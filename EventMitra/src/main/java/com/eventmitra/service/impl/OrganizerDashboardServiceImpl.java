package com.eventmitra.service.impl;

import java.time.LocalDate;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.eventmitra.dto.OrganizerDashboardResponse;
import com.eventmitra.entity.User;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.BookingRepository;
import com.eventmitra.repository.EventRepository;
import com.eventmitra.repository.PaymentRepository;
import com.eventmitra.repository.UserRepository;
import com.eventmitra.service.OrganizerDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrganizerDashboardServiceImpl implements OrganizerDashboardService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Override
    public OrganizerDashboardResponse getDashboard() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        long myEvents = eventRepository.countByOrganizer(organizer);

        long upcomingEvents =
                eventRepository.countByOrganizerAndEventDateGreaterThanEqual(
                        organizer,
                        LocalDate.now());

        Long ticketsSold = bookingRepository.getTicketsSold(organizer);

        Double revenue = paymentRepository.getRevenue(organizer);

        return OrganizerDashboardResponse.builder()
                .myEvents(myEvents)
                .ticketsSold(ticketsSold == null ? 0 : ticketsSold)
                .revenue(java.math.BigDecimal.valueOf(revenue == null ? 0.0 : revenue))
                .upcomingEvents(upcomingEvents)
                .build();
    }
}