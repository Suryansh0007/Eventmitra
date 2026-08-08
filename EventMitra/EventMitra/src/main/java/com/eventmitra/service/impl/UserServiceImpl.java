package com.eventmitra.service.impl;

import com.eventmitra.dto.AuthResponse;
import com.eventmitra.dto.LoginRequest;
import com.eventmitra.dto.UserRequest;
import com.eventmitra.entity.User;
import com.eventmitra.exception.DuplicateResourceException;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.UserRepository;
import com.eventmitra.security.JwtService;
import com.eventmitra.service.OtpService;
import com.eventmitra.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final ObjectProvider<OtpService> otpServiceProvider;

    @Override
    public User create(UserRequest request) {
        validateDuplicate(request.email(), request.mobileNumber(), null);
        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .mobileNumber(request.mobileNumber())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .enabled(false)
                .build();
        User saved = userRepository.save(user);
        otpServiceProvider.getObject().generateForUser(saved.getId());
        return saved;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Override
    public User update(Long id, UserRequest request) {
        User user = findById(id);
        validateDuplicate(request.email(), request.mobileNumber(), id);
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setMobileNumber(request.mobileNumber());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        userRepository.delete(findById(id));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var details = userDetailsService.loadUserByUsername(request.email());
        String token = jwtService.generateToken(details, user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }

    private void validateDuplicate(String email, String mobile, Long currentId) {
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (!existing.getId().equals(currentId)) {
                throw new DuplicateResourceException("Email already exists");
            }
        });
        userRepository.findByMobileNumber(mobile).ifPresent(existing -> {
            if (!existing.getId().equals(currentId)) {
                throw new DuplicateResourceException("Mobile number already exists");
            }
        });
    }
}
