package com.eventmitra.service;

import com.eventmitra.dto.CreateOrderRequest;
import com.eventmitra.dto.CreateOrderResponse;
import com.eventmitra.dto.VerifyPaymentRequest;
import com.eventmitra.entity.Payment;

import java.util.List;

public interface PaymentService {
    CreateOrderResponse createOrder(CreateOrderRequest request);
    Payment verify(VerifyPaymentRequest request);
    List<Payment> findAll();
    Payment findById(Long id);
}
