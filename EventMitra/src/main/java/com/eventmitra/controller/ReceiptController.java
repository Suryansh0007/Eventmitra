package com.eventmitra.controller;

import com.eventmitra.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(receiptService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(receiptService.findById(id));
    }

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<?> byPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(receiptService.findByPayment(paymentId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> byBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(receiptService.findByBooking(bookingId));
    }
}