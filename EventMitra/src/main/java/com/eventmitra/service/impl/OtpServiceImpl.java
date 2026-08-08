package com.eventmitra.service.impl;

import com.eventmitra.dto.OtpSendRequest;
import com.eventmitra.dto.OtpVerifyRequest;
import com.eventmitra.entity.User;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.notification.NotificationClient;
import com.eventmitra.notification.dto.SendOtpRequest;
import com.eventmitra.notification.dto.VerifyOtpRequest;
import com.eventmitra.repository.UserRepository;
import com.eventmitra.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final UserRepository userRepository;
    private final NotificationClient notificationClient;

    @Override
    public void send(OtpSendRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + request.email()));

        SendOtpRequest otpRequest = new SendOtpRequest();
        otpRequest.setEmail(user.getEmail());

        notificationClient.sendOtp(otpRequest);
    }

    @Override
    public void generateForUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + userId));

        SendOtpRequest otpRequest = new SendOtpRequest();
        otpRequest.setEmail(user.getEmail());

        notificationClient.sendOtp(otpRequest);
    }

    @Override
    @Transactional
    public void verify(OtpVerifyRequest request) {

        VerifyOtpRequest verifyRequest = new VerifyOtpRequest();
        verifyRequest.setEmail(request.email());
        verifyRequest.setOtp(request.otp());

        boolean verified = notificationClient.verifyOtp(verifyRequest);

        if (!verified) {
            throw new ResourceNotFoundException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setEnabled(true);

        userRepository.save(user);
    }
}