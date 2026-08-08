package com.eventmitra.dto;

import jakarta.validation.constraints.NotBlank;

public record RefundRequestDto(@NotBlank String reason) {
}
