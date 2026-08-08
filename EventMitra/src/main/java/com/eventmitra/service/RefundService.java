package com.eventmitra.service;

import com.eventmitra.dto.RefundRequestDto;
import com.eventmitra.entity.Refund;

import java.util.List;

public interface RefundService {
    Refund request(Long bookingId, RefundRequestDto request);
    List<Refund> findAll();
    Refund findById(Long id);
    List<Refund> findRequested();
    Refund approve(Long refundId);
    Refund reject(Long refundId);
}
