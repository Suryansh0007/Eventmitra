package com.eventmitra.dto;

public record CreateOrderResponse(String razorpayOrderId, Double amount, String currency, String keyId) {
}
