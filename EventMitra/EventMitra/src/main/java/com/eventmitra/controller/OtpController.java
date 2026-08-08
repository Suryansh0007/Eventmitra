package com.eventmitra.controller;

import com.eventmitra.dto.OtpSendRequest;
import com.eventmitra.dto.OtpVerifyRequest;
import com.eventmitra.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {
    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<?> send(@Valid @RequestBody OtpSendRequest request) {
        otpService.send(request);
        return ResponseEntity.ok(Map.of("message", "OTP sent using mock service"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody OtpVerifyRequest request) {
        otpService.verify(request);
        return ResponseEntity.ok(Map.of("message", "OTP verified and user activated"));
    }
}
