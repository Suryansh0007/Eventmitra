package com.eventmitra.service.impl;

import com.eventmitra.dto.BookingRequest;
import com.eventmitra.entity.Booking;
import com.eventmitra.enums.BookingStatus;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.exception.TicketUnavailableException;
import com.eventmitra.repository.BookingRepository;
import com.eventmitra.repository.EventRepository;
import com.eventmitra.repository.TicketRepository;
import com.eventmitra.repository.UserRepository;
import com.eventmitra.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional
    public Booking create(BookingRequest request) {
        var attendee = userRepository.findById(request.attendeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Attendee not found: " + request.attendeeId()));
        var event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + request.eventId()));
        var ticket = ticketRepository.findById(request.ticketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + request.ticketId()));
        if (!ticket.getEvent().getId().equals(event.getId())) {
            throw new TicketUnavailableException("Ticket does not belong to selected event");
        }
        if (ticket.getAvailableQuantity() < request.numberOfTickets()) {
            throw new TicketUnavailableException("Requested ticket quantity is unavailable");
        }
        ticket.setAvailableQuantity(ticket.getAvailableQuantity() - request.numberOfTickets());
        ticketRepository.save(ticket);
        Booking booking = Booking.builder()
                .attendee(attendee)
                .event(event)
                .ticket(ticket)
                .numberOfTickets(request.numberOfTickets())
                .totalAmount(ticket.getPrice() * request.numberOfTickets())
                .bookingStatus(BookingStatus.PENDING)
                .build();
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking findById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
    }

    @Override
    public Booking update(Long id, BookingRequest request) {
        Booking booking = findById(id);
        booking.setNumberOfTickets(request.numberOfTickets());
        return bookingRepository.save(booking);
    }

    @Override
    public void delete(Long id) {
        bookingRepository.delete(findById(id));
    }

    @Override
    public List<Booking> findByAttendee(Long attendeeId) {
        return bookingRepository.findByAttendeeId(attendeeId);
    }

    @Override
    public List<Booking> findByEvent(Long eventId) {
        return bookingRepository.findByEventId(eventId);
    }
}
