import api from "./axios";

export const getTicketsByEvent = (eventId) => api.get(`/tickets/event/${eventId}`);
export const getAllTickets = () => api.get("/tickets");
export const getTicketById = (id) => api.get(`/tickets/${id}`);

// TicketRequest: { ticketName, price, totalQuantity, availableQuantity, eventId }
export const createTicket = (payload) => api.post("/tickets", payload);
export const updateTicket = (id, payload) => api.put(`/tickets/${id}`, payload);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);
