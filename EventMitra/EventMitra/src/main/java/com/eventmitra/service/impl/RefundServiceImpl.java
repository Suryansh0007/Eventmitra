package com.eventmitra.service.impl;

import com.eventmitra.dto.RefundRequestDto;
import com.eventmitra.entity.Refund;
import com.eventmitra.enums.BookingStatus;
import com.eventmitra.enums.PaymentStatus;
import com.eventmitra.enums.RefundStatus;
import com.eventmitra.exception.RefundNotAllowedException;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.BookingRepository;
import com.eventmitra.repository.PaymentRepository;
import com.eventmitra.repository.RefundRepository;
import com.eventmitra.service.RefundService;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {
    private final RefundRepository refundRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Override
    public Refund request(Long bookingId, RefundRequestDto request) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new RefundNotAllowedException("Only confirmed bookings can request refund");
        }
        refundRepository.findByBookingId(bookingId).ifPresent(existing -> {
            throw new RefundNotAllowedException("Refund already requested for this booking");
        });
        Refund refund = Refund.builder()
                .booking(booking)
                .reason(request.reason())
                .refundAmount(booking.getTotalAmount())
                .refundStatus(RefundStatus.REQUESTED)
                .build();
        return refundRepository.save(refund);
    }

    @Override
    public List<Refund> findAll() {
        return refundRepository.findAll();
    }

    @Override
    public Refund findById(Long id) {
        return refundRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Refund not found: " + id));
    }

    @Override
    public List<Refund> findRequested() {
        return refundRepository.findByRefundStatus(RefundStatus.REQUESTED);
    }

    @Override
    @Transactional
    public Refund approve(Long refundId) {
        Refund refund = findById(refundId);
        if (refund.getRefundStatus() != RefundStatus.REQUESTED) {
            throw new RefundNotAllowedException("Only requested refunds can be approved");
        }
        var payment = paymentRepository.findByBookingId(refund.getBooking().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking"));
        if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
            throw new RefundNotAllowedException("Only successful payments can be refunded");
        }
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", Math.round(refund.getRefundAmount() * 100));
            client.payments.refund(payment.getRazorpayPaymentId(), refundRequest);
            refund.setRefundStatus(RefundStatus.APPROVED);
            refund.setRefundProcessedDate(LocalDateTime.now());
            refund.getBooking().setBookingStatus(BookingStatus.CANCELLED);
            bookingRepository.save(refund.getBooking());
            return refundRepository.save(refund);
        } catch (Exception ex) {
            throw new RefundNotAllowedException("Razorpay refund failed: " + ex.getMessage());
        }
    }

    @Override
    public Refund reject(Long refundId) {
        Refund refund = findById(refundId);
        if (refund.getRefundStatus() != RefundStatus.REQUESTED) {
            throw new RefundNotAllowedException("Only requested refunds can be rejected");
        }
        refund.setRefundStatus(RefundStatus.REJECTED);
        refund.setRefundProcessedDate(LocalDateTime.now());
        return refundRepository.save(refund);
    }
}
