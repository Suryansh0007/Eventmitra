import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import BookingSummary from "./pages/BookingSummary";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Organizer Pages
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import ManageTickets from "./pages/ManageTickets";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />

          <main className="app-main">
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/login" element={<Login />} />

              {/* Attendee Routes */}
              <Route
                path="/bookings/:id/summary"
                element={
                  <ProtectedRoute>
                    <BookingSummary />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bookings/:id/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/receipt/:id"
                element={
                  <ProtectedRoute>
                    <Receipt />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Organizer Routes */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute roles={["ORGANIZER"]}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/create-event"
                element={
                  <ProtectedRoute roles={["ORGANIZER"]}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/my-events"
                element={
                  <ProtectedRoute roles={["ORGANIZER"]}>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/edit-event/:id"
                element={
                  <ProtectedRoute roles={["ORGANIZER"]}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/manage-tickets/:id"
                element={
                  <ProtectedRoute roles={["ORGANIZER"]}>
                    <ManageTickets />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>

          <Footer />

          {/* AI Chatbot - Available on every page */}
          <ChatBot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}