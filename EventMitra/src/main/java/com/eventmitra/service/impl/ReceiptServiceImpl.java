package com.eventmitra.service.impl;

import com.eventmitra.entity.Payment;
import com.eventmitra.entity.Receipt;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.ReceiptRepository;
import com.eventmitra.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;

    @Override
    public Receipt generate(Payment payment) {

        Receipt receipt = Receipt.builder()
                .payment(payment)
                .receiptNumber("EM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        return receiptRepository.save(receipt);
    }

    @Override
    public List<Receipt> findAll() {
        return receiptRepository.findAll();
    }

    @Override
    public Receipt findById(Long id) {
        return receiptRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Receipt not found: " + id));
    }

    @Override
    public Receipt findByPayment(Long paymentId) {
        return receiptRepository.findByPaymentId(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Receipt not found for payment: " + paymentId));
    }

    @Override
    public Receipt findByBooking(Long bookingId) {
        return receiptRepository.findByPaymentBookingId(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Receipt not found for booking: " + bookingId));
    }
}