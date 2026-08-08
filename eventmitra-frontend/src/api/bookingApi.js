import api from "./axios";

// BookingRequest: { numberOfTickets, attendeeId, eventId, ticketId }
export const createBooking = (payload) => api.post("/bookings", payload);
export const getAllBookings = () => api.get("/bookings");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getBookingsByAttendee = (attendeeId) => api.get(`/bookings/attendee/${attendeeId}`);
export const getBookingsByEvent = (eventId) => api.get(`/bookings/event/${eventId}`);
export const updateBooking = (id, payload) => api.put(`/bookings/${id}`, payload);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
