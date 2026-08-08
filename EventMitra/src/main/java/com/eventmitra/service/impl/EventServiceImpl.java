package com.eventmitra.service.impl;

import com.eventmitra.dto.EventRequest;
import com.eventmitra.entity.Event;
import com.eventmitra.enums.EventCategory;
import com.eventmitra.enums.EventStatus;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.EventRepository;
import com.eventmitra.repository.UserRepository;
import com.eventmitra.service.EventService;
import com.eventmitra.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;

    @Override
    public Event create(EventRequest request) {
        Event event = map(new Event(), request);
        return eventRepository.save(event);
    }

    @Override
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    @Override
    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
    }

    @Override
    public Event update(Long id, EventRequest request) {
        return eventRepository.save(map(findById(id), request));
    }

    @Override
    public void delete(Long id) {

        Event event = findById(id);

        if (event.getImageUrl() != null && !event.getImageUrl().isBlank()) {
            imageStorageService.deleteEventImage(event.getImageUrl());
        }

        eventRepository.delete(event);
    }

    @Override
    public List<Event> findByCategory(EventCategory category) {
        return eventRepository.findByCategory(category);
    }

    @Override
    public List<Event> findByLocation(String location) {
        return eventRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public List<Event> findByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    @Override
    public Event uploadImage(Long eventId, MultipartFile image) {

        Event event = findById(eventId);

        // Delete old image if present
        if (event.getImageUrl() != null && !event.getImageUrl().isBlank()) {
            imageStorageService.deleteEventImage(event.getImageUrl());
        }

        String fileName = imageStorageService.uploadEventImage(image);

        event.setImageUrl(fileName);

        return eventRepository.save(event);
    }

    private Event map(Event event, EventRequest request) {

        var organizer = userRepository.findById(request.organizerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizer not found: " + request.organizerId()));

        event.setEventName(request.eventName());
        event.setDescription(request.description());
        event.setEventDate(request.eventDate());
        event.setStartTime(request.startTime());
        event.setEndTime(request.endTime());
        event.setLocation(request.location());
        event.setCategory(request.category());
        event.setStatus(request.status() == null
                ? EventStatus.UPCOMING
                : request.status());
        event.setOrganizer(organizer);

        return event;
    }
}