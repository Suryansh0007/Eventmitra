package com.eventmitra.service;

import com.eventmitra.dto.TicketRequest;
import com.eventmitra.entity.Ticket;

import java.util.List;

public interface TicketService {
    Ticket create(TicketRequest request);
    List<Ticket> findAll();
    Ticket findById(Long id);
    Ticket update(Long id, TicketRequest request);
    void delete(Long id);
    List<Ticket> findByEvent(Long eventId);
}
