package com.eventmitra.service;

import com.eventmitra.dto.BookingRequest;
import com.eventmitra.entity.Booking;

import java.util.List;

public interface BookingService {
    Booking create(BookingRequest request);
    List<Booking> findAll();
    Booking findById(Long id);
    Booking update(Long id, BookingRequest request);
    void delete(Long id);
    List<Booking> findByAttendee(Long attendeeId);
    List<Booking> findByEvent(Long eventId);
}
