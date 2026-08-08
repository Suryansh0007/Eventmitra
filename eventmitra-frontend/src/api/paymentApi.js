import api from "./axios";

// CreateOrderRequest: { bookingId } -> CreateOrderResponse { razorpayOrderId, amount, currency, keyId }
export const createOrder = (bookingId) => api.post("/payments/create-order", { bookingId });

// VerifyPaymentRequest: { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
export const verifyPayment = (payload) => api.post("/payments/verify", payload);

export const getAllPayments = () => api.get("/payments");
export const getPaymentById = (id) => api.get(`/payments/${id}`);
