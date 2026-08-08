package com.eventmitra.controller;

import com.eventmitra.dto.RefundRequestDto;
import com.eventmitra.service.RefundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/refunds")
@RequiredArgsConstructor
public class RefundController {
    private final RefundService refundService;

    @PostMapping("/request/{bookingId}")
    @PreAuthorize("hasAnyRole('ADMIN','ATTENDEE')")
    public ResponseEntity<?> request(@PathVariable Long bookingId, @Valid @RequestBody RefundRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(refundService.request(bookingId, request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(refundService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(refundService.findById(id));
    }

    @GetMapping("/requested")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> requested() {
        return ResponseEntity.ok(refundService.findRequested());
    }

    @PutMapping("/approve/{refundId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long refundId) {
        return ResponseEntity.ok(refundService.approve(refundId));
    }

    @PutMapping("/reject/{refundId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reject(@PathVariable Long refundId) {
        return ResponseEntity.ok(refundService.reject(refundId));
    }
}
