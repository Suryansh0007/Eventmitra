import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { getTicketsByEvent } from "../api/ticketApi";
import { createBooking } from "../api/bookingApi";
import { apiUrl } from "../api/baseUrl";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime, categoryLabel } from "../utils/format";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    setLoading(true);

    Promise.all([getEventById(id), getTicketsByEvent(id)])
      .then(([evRes, tkRes]) => {
        setEvent(evRes.data);
        setTickets(tkRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load this event. It may no longer be available.");
        setLoading(false);
      });
  }, [id]);

  const selectedTicketId = Object.keys(quantities).find(
    (k) => quantities[k] > 0
  );

  const selectedQty = selectedTicketId ? quantities[selectedTicketId] : 0;

  const selectedTicket = tickets.find(
    (t) => String(t.id) === selectedTicketId
  );

  const totalAmount = selectedTicket
    ? selectedTicket.price * selectedQty
    : 0;

  const setQty = (ticketId, delta, max) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));

      const cleared = {};
      Object.keys(prev).forEach((k) => (cleared[k] = 0));

      return {
        ...cleared,
        [ticketId]: next,
      };
    });
  };

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/events/${id}`,
          },
        },
      });
      return;
    }

    if (!selectedTicket || selectedQty < 1) return;

    try {
      setBooking(true);
      setBookError("");

      const res = await createBooking({
        numberOfTickets: selectedQty,
        attendeeId: user.userId,
        eventId: Number(id),
        ticketId: selectedTicket.id,
      });

      navigate(`/bookings/${res.data.id}/summary`);
    } catch (err) {
      setBookError(
        err.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        Loading event...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: "40px 24px" }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container em-details-page">

      <h2 className="section-title" style={{ marginBottom: 20 }}>
        Event Details
      </h2>

      <div className="em-details-top">

        {event.imageUrl ? (
          <img
            src={apiUrl(`/uploads/${event.imageUrl}`)}
            alt={event.eventName}
            className="em-details-hero"
          />
        ) : (
          <div className="em-details-hero" />
        )}

        <div className="em-details-info">

          <span className="badge badge-category">
            {categoryLabel(event.category)}
          </span>

          <h1>{event.eventName}</h1>

          <div className="em-details-meta">
            <div>🗓 {formatDate(event.eventDate)}</div>
            <div>🕐 {formatTime(event.startTime)}</div>
            <div>📍 {event.location}</div>
          </div>

          <p className="em-details-desc">
            {event.description ||
              "Join us for an unforgettable experience — full details coming soon."}
          </p>

        </div>

      </div>

      <div className="card em-ticket-card">

        <h3>Select Ticket Type</h3>

        {tickets.length === 0 && (
          <div className="state-box" style={{ padding: 24 }}>
            Tickets for this event haven't been released yet.
          </div>
        )}

        {tickets.map((t) => {
          const qty = quantities[t.id] || 0;

          return (
            <div className="em-ticket-row" key={t.id}>

              <div>

                <div className="em-ticket-name">
                  {t.ticketName}
                </div>

                <div className="em-ticket-sub">
                  ₹{t.price.toLocaleString("en-IN")} · Available:{" "}
                  {t.availableQuantity}
                </div>

              </div>

              <div className="em-qty-stepper">

                <button
                  onClick={() =>
                    setQty(
                      t.id,
                      -1,
                      t.availableQuantity
                    )
                  }
                  disabled={qty === 0}
                >
                  −
                </button>

                <span>{qty}</span>

                <button
                  onClick={() =>
                    setQty(
                      t.id,
                      1,
                      t.availableQuantity
                    )
                  }
                  disabled={qty >= t.availableQuantity}
                >
                  +
                </button>

              </div>

            </div>
          );
        })}

        {tickets.length > 0 && (
          <div className="em-ticket-footer">

            <div className="em-total">
              Total Amount:{" "}
              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

            {bookError && (
              <div
                className="form-error"
                style={{ marginRight: 12 }}
              >
                {bookError}
              </div>
            )}

            <button
              className="btn btn-primary"
              disabled={selectedQty < 1 || booking}
              onClick={handleBookNow}
            >
              {booking ? "Booking..." : "Book Now"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
