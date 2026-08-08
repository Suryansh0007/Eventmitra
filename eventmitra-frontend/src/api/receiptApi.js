import api from "./axios";

// Get all receipts
export const getAllReceipts = () => api.get("/receipts");

// Get receipt by receipt ID
export const getReceiptById = (id) => api.get(`/receipts/${id}`);

// Get receipt by payment ID
export const getReceiptByPayment = (paymentId) =>
  api.get(`/receipts/payment/${paymentId}`);

// Get receipt by booking ID
export const getReceiptByBooking = (bookingId) =>
  api.get(`/receipts/booking/${bookingId}`);