package com.eventmitra.service.impl;

import com.eventmitra.dto.RefundRequestDto;
import com.eventmitra.entity.Refund;
import com.eventmitra.entity.Ticket;
import com.eventmitra.enums.BookingStatus;
import com.eventmitra.enums.PaymentStatus;
import com.eventmitra.enums.RefundStatus;
import com.eventmitra.exception.RefundNotAllowedException;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.notification.NotificationClient;
import com.eventmitra.notification.dto.AuditLogRequest;
import com.eventmitra.notification.dto.EmailRequest;
import com.eventmitra.repository.BookingRepository;
import com.eventmitra.repository.PaymentRepository;
import com.eventmitra.repository.RefundRepository;
import com.eventmitra.repository.TicketRepository;
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
    private final TicketRepository ticketRepository;
    private final NotificationClient notificationClient;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Override
    public Refund request(Long bookingId, RefundRequestDto request) {

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found: " + bookingId));

        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new RefundNotAllowedException(
                    "Only confirmed bookings can request refund");
        }

        refundRepository.findByBookingId(bookingId).ifPresent(existing -> {
            throw new RefundNotAllowedException(
                    "Refund already requested for this booking");
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
        return refundRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Refund not found: " + id));
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
            throw new RefundNotAllowedException(
                    "Only requested refunds can be approved");
        }

        var booking = refund.getBooking();

        var payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found for booking"));

        if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
            throw new RefundNotAllowedException(
                    "Only successful payments can be refunded");
        }

        try {

            System.out.println("========== REFUND START ==========");
            System.out.println("Booking ID  : " + booking.getId());
            System.out.println("Payment ID  : " + payment.getRazorpayPaymentId());
            System.out.println("Order ID    : " + payment.getRazorpayOrderId());
            System.out.println("Amount      : " + refund.getRefundAmount());

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", Math.round(refund.getRefundAmount() * 100));

            System.out.println("Refund JSON : " + refundRequest.toString());

            client.payments.refund(
                    payment.getRazorpayPaymentId(),
                    refundRequest
            );

            System.out.println("Refund API called successfully.");

            refund.setRefundStatus(RefundStatus.APPROVED);
            refund.setRefundProcessedDate(LocalDateTime.now());

            booking.setBookingStatus(BookingStatus.CANCELLED);

            Ticket ticket = booking.getTicket();

            ticket.setAvailableQuantity(
                    ticket.getAvailableQuantity()
                            + booking.getNumberOfTickets()
            );

            ticketRepository.save(ticket);
            bookingRepository.save(booking);

            Refund savedRefund = refundRepository.save(refund);

            EmailRequest email = new EmailRequest();
            email.setToEmail(booking.getAttendee().getEmail());
            email.setSubject("Refund Approved - EventMitra");

            email.setBody("""
                    <h2>Refund Approved</h2>

                    <p>Hello %s,</p>

                    <p>Your refund request has been approved successfully.</p>

                    <hr>

                    <p><b>Event :</b> %s</p>

                    <p><b>Refund Amount :</b> ₹%.2f</p>

                    <p>Your refund will be credited according to Razorpay's settlement timeline.</p>

                    <hr>

                    <p>Thank you for using EventMitra.</p>
                    """
                    .formatted(
                            booking.getAttendee().getFullName(),
                            booking.getEvent().getEventName(),
                            refund.getRefundAmount()
                    ));

            notificationClient.sendEmail(email);

            AuditLogRequest audit = new AuditLogRequest();
            audit.setAction("REFUND_APPROVED");
            audit.setUsername(booking.getAttendee().getEmail());
            audit.setDetails(
                    "Refund approved for Booking ID "
                            + booking.getId()
                            + " of event "
                            + booking.getEvent().getEventName()
            );

            notificationClient.saveAuditLog(audit);

            System.out.println("========== REFUND SUCCESS ==========");

            return savedRefund;

        } catch (Exception ex) {

            System.out.println("========== REFUND FAILED ==========");
            ex.printStackTrace();

            throw new RefundNotAllowedException(
                    "Razorpay refund failed: " + ex.getMessage()
            );
        }
    }

    @Override
    public Refund reject(Long refundId) {

        Refund refund = findById(refundId);

        if (refund.getRefundStatus() != RefundStatus.REQUESTED) {
            throw new RefundNotAllowedException(
                    "Only requested refunds can be rejected");
        }

        refund.setRefundStatus(RefundStatus.REJECTED);
        refund.setRefundProcessedDate(LocalDateTime.now());

        return refundRepository.save(refund);
    }
}