import api from "./axios";

// ---------------- PUBLIC ----------------

export const getAllEvents = () => api.get("/events");

export const getEventById = (id) =>
  api.get(`/events/${id}`);

export const getEventsByCategory = (category) =>
  api.get(`/events/category/${category}`);

export const getEventsByLocation = (location) =>
  api.get(`/events/location/${location}`);

// ---------------- ORGANIZER ----------------

export const createEvent = (payload) =>
  api.post("/events", payload);

export const updateEvent = (id, payload) =>
  api.put(`/events/${id}`, payload);

export const uploadEventImage = (eventId, image) => {
  const formData = new FormData();
  formData.append("image", image);

  return api.post(`/events/${eventId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEvent = (id) =>
  api.delete(`/events/${id}`);

export const getOrganizerEvents = (organizerId) =>
  api.get(`/events/organizer/${organizerId}`);