package com.eventmitra.service;

import com.eventmitra.dto.EventRequest;
import com.eventmitra.entity.Event;
import com.eventmitra.enums.EventCategory;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EventService {

    Event create(EventRequest request);

    List<Event> findAll();

    Event findById(Long id);

    Event update(Long id, EventRequest request);

    void delete(Long id);

    List<Event> findByCategory(EventCategory category);

    List<Event> findByLocation(String location);

    List<Event> findByOrganizer(Long organizerId);

    // NEW METHOD FOR IMAGE
    Event uploadImage(Long eventId, MultipartFile image);
}