package com.eventmitra.service.impl;

import com.eventmitra.dto.OtpSendRequest;
import com.eventmitra.dto.OtpVerifyRequest;
import com.eventmitra.entity.OtpVerification;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.OtpVerificationRepository;
import com.eventmitra.repository.UserRepository;
import com.eventmitra.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public void send(OtpSendRequest request) {
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.email()));
        generateForUser(user.getId());
    }

    @Override
    public void generateForUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        OtpVerification verification = OtpVerification.builder()
                .user(user)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .build();
        otpRepository.save(verification);
        System.out.println("Mock OTP for " + user.getEmail() + ": " + otp);
    }

    @Override
    @Transactional
    public void verify(OtpVerifyRequest request) {
        OtpVerification verification = otpRepository.findTopByUserEmailOrderByIdDesc(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("OTP not found for user"));
        if (Boolean.TRUE.equals(verification.getVerified())) {
            return;
        }
        if (verification.getExpiryTime().isBefore(LocalDateTime.now()) || !verification.getOtp().equals(request.otp())) {
            throw new ResourceNotFoundException("Invalid or expired OTP");
        }
        verification.setVerified(true);
        verification.getUser().setEnabled(true);
        userRepository.save(verification.getUser());
        otpRepository.save(verification);
    }
}
