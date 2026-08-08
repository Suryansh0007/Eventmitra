import api from "./axios";

// UserRequest: { fullName, email, mobileNumber, password, role }
export const registerUser = (payload) => api.post("/auth/register", payload);

// LoginRequest: { email, password } -> AuthResponse { token, userId, email, role }
export const loginUser = (payload) => api.post("/auth/login", payload);

// OtpSendRequest: { email }
export const sendOtp = (email) => api.post("/otp/send", { email });

// OtpVerifyRequest: { email, otp }
export const verifyOtp = (email, otp) => api.post("/otp/verify", { email, otp });
