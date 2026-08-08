package com.eventmitra.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NotificationProperties {

    @Value("${notification.service.url}")
    private String baseUrl;

    public String getBaseUrl() {
        return baseUrl;
    }
}