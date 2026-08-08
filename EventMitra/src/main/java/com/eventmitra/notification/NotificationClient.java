package com.eventmitra.notification;

import com.eventmitra.notification.dto.AuditLogRequest;
import com.eventmitra.notification.dto.EmailRequest;
import com.eventmitra.notification.dto.SendOtpRequest;
import com.eventmitra.notification.dto.VerifyOtpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class NotificationClient {

    private final RestTemplate restTemplate;
    private final NotificationProperties properties;

    public void sendEmail(EmailRequest request) {

        System.out.println("===== SEND EMAIL =====");
        System.out.println("URL : " + properties.getBaseUrl());

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    properties.getBaseUrl() + "/api/Notification/send-email",
                    request,
                    String.class
            );

            System.out.println("Status : " + response.getStatusCode());
            System.out.println("Response : " + response.getBody());

        } catch (Exception ex) {
            System.out.println("Email Service Error");
            ex.printStackTrace();
        }
    }

    public void sendOtp(SendOtpRequest request) {

        System.out.println("===== SEND OTP =====");
        System.out.println("Email : " + request.getEmail());
        System.out.println("URL : " + properties.getBaseUrl() + "/api/Notification/send-otp");

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    properties.getBaseUrl() + "/api/Notification/send-otp",
                    request,
                    String.class
            );

            System.out.println("Status : " + response.getStatusCode());
            System.out.println("Response : " + response.getBody());

        } catch (Exception ex) {
            System.out.println("OTP Service Error");
            ex.printStackTrace();
        }
    }

    public boolean verifyOtp(VerifyOtpRequest request) {

        System.out.println("===== VERIFY OTP =====");

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    properties.getBaseUrl() + "/api/Notification/verify-otp",
                    request,
                    String.class
            );

            System.out.println("Status : " + response.getStatusCode());

            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception ex) {
            System.out.println("Verify OTP Error");
            ex.printStackTrace();
            return false;
        }
    }

    public void saveAuditLog(AuditLogRequest request) {

        System.out.println("===== SAVE AUDIT LOG =====");

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    properties.getBaseUrl() + "/api/Notification/audit-log",
                    request,
                    String.class
            );

            System.out.println("Status : " + response.getStatusCode());

        } catch (Exception ex) {
            System.out.println("Audit Log Error");
            ex.printStackTrace();
        }
    }
}