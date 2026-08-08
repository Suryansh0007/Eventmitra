package com.eventmitra.repository;

import com.eventmitra.entity.Refund;
import com.eventmitra.enums.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByRefundStatus(RefundStatus refundStatus);
    Optional<Refund> findByBookingId(Long bookingId);
}
