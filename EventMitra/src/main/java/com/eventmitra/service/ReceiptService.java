package com.eventmitra.service;

import com.eventmitra.entity.Payment;
import com.eventmitra.entity.Receipt;

import java.util.List;

public interface ReceiptService {

    Receipt generate(Payment payment);

    List<Receipt> findAll();

    Receipt findById(Long id);

    Receipt findByPayment(Long paymentId);

    Receipt findByBooking(Long bookingId);
}