package com.eventmitra.service.impl;

import com.eventmitra.dto.CreateOrderRequest;
import com.eventmitra.dto.CreateOrderResponse;
import com.eventmitra.dto.VerifyPaymentRequest;
import com.eventmitra.entity.Payment;
import com.eventmitra.enums.BookingStatus;
import com.eventmitra.enums.PaymentStatus;
import com.eventmitra.exception.PaymentFailedException;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.notification.NotificationClient;
import com.eventmitra.notification.dto.AuditLogRequest;
import com.eventmitra.notification.dto.EmailRequest;
import com.eventmitra.repository.BookingRepository;
import com.eventmitra.repository.PaymentRepository;
import com.eventmitra.service.PaymentService;
import com.eventmitra.service.ReceiptService;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptService receiptService;
    private final NotificationClient notificationClient;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Override
    public CreateOrderResponse createOrder(CreateOrderRequest request) {

        var booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found: " + request.bookingId()));

        try {

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", Math.round(booking.getTotalAmount() * 100));
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "booking_" + booking.getId());

            JSONObject notes = new JSONObject();
            notes.put("bookingId", booking.getId());
            orderRequest.put("notes", notes);

            var order = client.orders.create(orderRequest);

            return new CreateOrderResponse(
                    order.get("id"),
                    booking.getTotalAmount(),
                    currency,
                    keyId
            );

        } catch (Exception ex) {

            throw new PaymentFailedException(
                    "Unable to create Razorpay order: " + ex.getMessage()
            );
        }
    }

    @Override
    @Transactional
    public Payment verify(VerifyPaymentRequest request) {

        var booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found: " + request.bookingId()));

        try {

            JSONObject attributes = new JSONObject();

            attributes.put("razorpay_order_id", request.razorpayOrderId());
            attributes.put("razorpay_payment_id", request.razorpayPaymentId());
            attributes.put("razorpay_signature", request.razorpaySignature());

            if (!Utils.verifyPaymentSignature(attributes, keySecret)) {
                throw new PaymentFailedException("Invalid Razorpay signature");
            }

            Payment payment = Payment.builder()
                    .amount(booking.getTotalAmount())
                    .razorpayOrderId(request.razorpayOrderId())
                    .razorpayPaymentId(request.razorpayPaymentId())
                    .razorpaySignature(request.razorpaySignature())
                    .paymentStatus(PaymentStatus.SUCCESS)
                    .booking(booking)
                    .build();

            Payment saved = paymentRepository.save(payment);

            booking.setBookingStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            // Generate Receipt
            receiptService.generate(saved);

            // ==========================
            // Send Booking Confirmation Email
            // ==========================

            EmailRequest email = new EmailRequest();

            email.setToEmail(booking.getAttendee().getEmail());
            email.setSubject("Booking Confirmed - EventMitra");

            email.setBody("""
                    <h2>Booking Confirmed 🎉</h2>

                    <p>Hello %s,</p>

                    <p>Your booking has been confirmed successfully.</p>

                    <hr>

                    <p><b>Event :</b> %s</p>
                    <p><b>Tickets :</b> %d</p>
                    <p><b>Total Amount :</b> ₹%.2f</p>
                    <p><b>Booking Id :</b> %d</p>

                    <hr>

                    <p>Thank you for choosing EventMitra.</p>
                    """
                    .formatted(
                            booking.getAttendee().getFullName(),
                            booking.getEvent().getEventName(),
                            booking.getNumberOfTickets(),
                            booking.getTotalAmount(),
                            booking.getId()
                    ));

            notificationClient.sendEmail(email);

            // ==========================
            // Save Audit Log
            // ==========================

            AuditLogRequest audit = new AuditLogRequest();

            audit.setAction("BOOKING_CONFIRMED");
            audit.setUsername(booking.getAttendee().getEmail());

            audit.setDetails(
                    "Booking ID "
                            + booking.getId()
                            + " confirmed successfully for event "
                            + booking.getEvent().getEventName()
            );

            notificationClient.saveAuditLog(audit);

            return saved;

        } catch (PaymentFailedException ex) {

            throw ex;

        } catch (Exception ex) {

            throw new PaymentFailedException(
                    "Payment verification failed: " + ex.getMessage()
            );
        }
    }

    @Override
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment findById(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found: " + id));
    }
}