package com.eventmitra.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TicketRequest(
        @NotBlank String ticketName,
        @NotNull @Min(0) Double price,
        @NotNull @Min(0) Integer totalQuantity,
        @NotNull @Min(0) Integer availableQuantity,
        @NotNull Long eventId
) {
}
