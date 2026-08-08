import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import { Login, Otp, Register } from "./pages/Auth";
import BookingSummary from "./pages/BookingSummary";
import EventDetails from "./pages/EventDetails";
import Events from "./pages/Events";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import { apiRequest, post, setToken } from "./services/api";
import { demoBookings, demoEvents, demoTickets, eventImages } from "./data/mockData";

export default function App() {
  const [page, setPage] = useState("home");
  const [events, setEvents] = useState(demoEvents);
  const [selectedEvent, setSelectedEvent] = useState(demoEvents[0]);
  const [tickets, setTickets] = useState(demoTickets);
  const [quantities, setQuantities] = useState({});
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({ query: "", category: "ALL" });
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("eventmitra_user") || "null"));
  const [registerForm, setRegisterForm] = useState({ fullName: "", email: "", mobileNumber: "", password: "", role: "ATTENDEE" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    apiRequest("/events")
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setEvents(data.map((event, index) => ({
            ...event,
            image: Object.values(eventImages)[index % Object.values(eventImages).length],
            price: event.price || demoEvents[index % demoEvents.length]?.price || 0
          })));
        }
      })
      .catch(() => {});
  }, []);

  const selectedTickets = useMemo(() => tickets
    .filter((ticket) => quantities[ticket.id] > 0)
    .map((ticket) => ({ ...ticket, quantity: quantities[ticket.id] })), [tickets, quantities]);

  function openEvent(event) {
    setSelectedEvent(event);
    setQuantities({});
    apiRequest(`/tickets/event/${event.id}`)
      .then((data) => setTickets(Array.isArray(data) && data.length ? data : demoTickets))
      .catch(() => setTickets(demoTickets));
    setPage("details");
  }

  function startBooking() {
    setPage("summary");
  }

  async function confirmBooking(amount) {
    const firstTicket = selectedTickets[0];
    const payload = {
      numberOfTickets: selectedTickets.reduce((sum, item) => sum + item.quantity, 0),
      attendeeId: user?.id || 2,
      eventId: selectedEvent.id,
      ticketId: firstTicket?.id || 1
    };
    try {
      const saved = await post("/bookings", payload);
      setBooking({ id: saved.id, backendId: saved.id, amount: saved.totalAmount || amount });
    } catch {
      setBooking({ id: "BKG0012", amount });
    }
    setPage("payment");
  }

  async function payNow() {
    setMessage("");
    try {
      await post("/payments/create-order", { bookingId: booking?.backendId || booking?.id });
      setMessage("Razorpay order created. Complete checkout, then call payment verify from backend flow.");
    } catch (error) {
      setMessage(error.message || "Demo mode: configure Razorpay credentials in backend to create live order.");
    }
  }

  async function onRegister(event) {
    event.preventDefault();
    setMessage("");
    try {
      await post("/auth/register", registerForm);
      setMessage("Account created. Check backend console for mock OTP.");
      setPage("otp");
    } catch (error) {
      setMessage(error.message || "Registration failed");
    }
  }

  async function onLogin(event) {
    event.preventDefault();
    setMessage("");
    try {
      const data = await post("/auth/login", loginForm);
      setToken(data.token);
      const nextUser = { id: data.userId, email: data.email, role: data.role };
      localStorage.setItem("eventmitra_user", JSON.stringify(nextUser));
      setUser(nextUser);
      setPage(data.role === "ADMIN" ? "admin" : "home");
    } catch (error) {
      setMessage(error.message || "Login failed. Verify OTP before login.");
    }
  }

  async function onVerify() {
    try {
      await post("/otp/verify", { email: registerForm.email, otp: otp.join("") });
      setMessage("OTP verified. You can login now.");
      setPage("login");
    } catch (error) {
      setMessage(error.message || "OTP verification failed");
    }
  }

  if (page === "admin") return <AdminDashboard setPage={setPage} />;

  return (
    <div className="app">
      <Header page={page} setPage={setPage} user={user} setUser={setUser} />
      {page === "home" && <Home events={events} setPage={setPage} openEvent={openEvent} />}
      {page === "events" && <Events events={events} openEvent={openEvent} filters={filters} setFilters={setFilters} />}
      {page === "details" && <EventDetails event={selectedEvent} tickets={tickets} quantities={quantities} setQuantities={setQuantities} startBooking={startBooking} />}
      {page === "summary" && <BookingSummary event={selectedEvent} selectedTickets={selectedTickets} setPage={setPage} confirmBooking={confirmBooking} />}
      {page === "payment" && <Payment booking={booking} event={selectedEvent} payNow={payNow} message={message} />}
      {page === "bookings" && <MyBookings bookings={demoBookings} />}
      {page === "register" && <Register form={registerForm} setForm={setRegisterForm} onRegister={onRegister} setPage={setPage} message={message} />}
      {page === "login" && <Login form={loginForm} setForm={setLoginForm} onLogin={onLogin} setPage={setPage} message={message} />}
      {page === "otp" && <Otp otp={otp} setOtp={setOtp} mobile={registerForm.mobileNumber} onVerify={onVerify} message={message} />}
      {page === "about" && <About />}
    </div>
  );
}
