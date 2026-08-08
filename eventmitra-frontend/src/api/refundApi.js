import api from "./axios";

// RefundRequestDto: { reason }
export const requestRefund = (bookingId, reason) =>
  api.post(`/refunds/request/${bookingId}`, { reason });

export const getAllRefunds = () => api.get("/refunds");
export const getRefundById = (id) => api.get(`/refunds/${id}`);
export const getRequestedRefunds = () => api.get("/refunds/requested");
export const approveRefund = (refundId) => api.put(`/refunds/approve/${refundId}`);
export const rejectRefund = (refundId) => api.put(`/refunds/reject/${refundId}`);
