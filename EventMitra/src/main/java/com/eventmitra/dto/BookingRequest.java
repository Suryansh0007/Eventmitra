package com.eventmitra.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BookingRequest(
        @NotNull @Min(1) Integer numberOfTickets,
        @NotNull Long attendeeId,
        @NotNull Long eventId,
        @NotNull Long ticketId
) {
}
