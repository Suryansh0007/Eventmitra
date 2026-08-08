package com.eventmitra.dto;

import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(@NotNull Long bookingId) {
}
