package com.eventmitra.notification.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditLogRequest {

    private String action;

    private String username;

    private String details;
}