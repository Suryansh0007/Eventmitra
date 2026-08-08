package com.eventmitra.controller;

import com.eventmitra.dto.BookingRequest;
import com.eventmitra.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ATTENDEE')")
    public ResponseEntity<?> create(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(request));
    }

    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ATTENDEE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/attendee/{attendeeId}")
    public ResponseEntity<?> byAttendee(@PathVariable Long attendeeId) {
        return ResponseEntity.ok(bookingService.findByAttendee(attendeeId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> byEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(bookingService.findByEvent(eventId));
    }
}
