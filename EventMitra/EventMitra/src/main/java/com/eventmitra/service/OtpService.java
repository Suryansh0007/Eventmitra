package com.eventmitra.service;

import com.eventmitra.dto.OtpSendRequest;
import com.eventmitra.dto.OtpVerifyRequest;

public interface OtpService {
    void send(OtpSendRequest request);
    void generateForUser(Long userId);
    void verify(OtpVerifyRequest request);
}
