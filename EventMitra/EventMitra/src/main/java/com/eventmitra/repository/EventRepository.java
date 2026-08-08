package com.eventmitra.repository;

import com.eventmitra.entity.Event;
import com.eventmitra.enums.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(EventCategory category);
    List<Event> findByLocationContainingIgnoreCase(String location);
    List<Event> findByOrganizerId(Long organizerId);
}
