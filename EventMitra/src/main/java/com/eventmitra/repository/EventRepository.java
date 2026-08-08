package com.eventmitra.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventmitra.entity.Event;
import com.eventmitra.entity.User;
import com.eventmitra.enums.EventCategory;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCategory(EventCategory category);

    List<Event> findByLocationContainingIgnoreCase(String location);

    List<Event> findByOrganizerId(Long organizerId);

    // Dashboard
    long countByOrganizer(User organizer);

    long countByOrganizerAndEventDateGreaterThanEqual(User organizer, LocalDate eventDate);

}