package com.eventmitra.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eventmitra.entity.Payment;
import com.eventmitra.entity.User;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    // Dashboard - Total Revenue
    @Query("""
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            WHERE p.booking.event.organizer = :organizer
            AND p.paymentStatus = com.eventmitra.enums.PaymentStatus.SUCCESS
            """)
    Double getRevenue(@Param("organizer") User organizer);

}