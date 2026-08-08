package com.eventmitra.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eventmitra.entity.Booking;
import com.eventmitra.entity.User;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByAttendeeId(Long attendeeId);

    List<Booking> findByEventId(Long eventId);

    // Dashboard - Total Tickets Sold
    @Query("""
            SELECT COALESCE(SUM(b.numberOfTickets), 0)
            FROM Booking b
            WHERE b.event.organizer = :organizer
            AND b.bookingStatus = com.eventmitra.enums.BookingStatus.CONFIRMED
            """)
    Long getTicketsSold(@Param("organizer") User organizer);

}