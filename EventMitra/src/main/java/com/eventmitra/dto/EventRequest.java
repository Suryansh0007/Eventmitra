package com.eventmitra.dto;

import com.eventmitra.enums.EventCategory;
import com.eventmitra.enums.EventStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventRequest(
        @NotBlank String eventName,
        String description,
        @FutureOrPresent @NotNull LocalDate eventDate,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @NotBlank String location,
        @NotNull EventCategory category,
        EventStatus status,
        @NotNull Long organizerId
) {
}
