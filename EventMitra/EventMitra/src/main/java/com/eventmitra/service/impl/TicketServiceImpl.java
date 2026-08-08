package com.eventmitra.service.impl;

import com.eventmitra.dto.TicketRequest;
import com.eventmitra.entity.Ticket;
import com.eventmitra.exception.ResourceNotFoundException;
import com.eventmitra.repository.EventRepository;
import com.eventmitra.repository.TicketRepository;
import com.eventmitra.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;

    @Override
    public Ticket create(TicketRequest request) {
        return ticketRepository.save(map(new Ticket(), request));
    }

    @Override
    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket findById(Long id) {
        return ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
    }

    @Override
    public Ticket update(Long id, TicketRequest request) {
        return ticketRepository.save(map(findById(id), request));
    }

    @Override
    public void delete(Long id) {
        ticketRepository.delete(findById(id));
    }

    @Override
    public List<Ticket> findByEvent(Long eventId) {
        return ticketRepository.findByEventId(eventId);
    }

    private Ticket map(Ticket ticket, TicketRequest request) {
        var event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + request.eventId()));
        ticket.setTicketName(request.ticketName());
        ticket.setPrice(request.price());
        ticket.setTotalQuantity(request.totalQuantity());
        ticket.setAvailableQuantity(request.availableQuantity());
        ticket.setEvent(event);
        return ticket;
    }
}
