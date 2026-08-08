import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../api/baseUrl";
import { getBookingById } from "../api/bookingApi";
import { formatCurrency, formatDate, formatTime } from "../utils/format";
import "./BookingSummary.css";

export default function BookingSummary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBookingById(id)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load this booking.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        Loading booking...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: "40px 24px" }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const {
    event,
    ticket,
    numberOfTickets,
    totalAmount,
    bookingStatus,
  } = booking;

  return (
    <div className="container em-summary-page">

      <Link to={`/events/${event.id}`} className="em-back-link">
        ← Back to Event
      </Link>

      <div className="card em-summary-card">

        <div className="em-summary-top">

          <div className="em-summary-thumb">

            {event.imageUrl ? (
              <img
                src={apiUrl(`/uploads/${event.imageUrl}`)}
                alt={event.eventName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px"
                }}
              />
            ) : null}

          </div>

          <div>

            <h2>{event.eventName}</h2>

            <div className="em-summary-meta">
              <div>🗓 {formatDate(event.eventDate)}</div>
              <div>🕐 {formatTime(event.startTime)}</div>
              <div>📍 {event.location}</div>
            </div>

          </div>

        </div>

        <h4 className="em-summary-subhead">
          Ticket Details
        </h4>

        <table className="em-summary-table">
          <thead>
            <tr>
              <th>Ticket Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th style={{ textAlign: "right" }}>
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{ticket.ticketName}</td>
              <td>{formatCurrency(ticket.price)}</td>
              <td>{numberOfTickets}</td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="em-summary-total-row">
          <span>Total Amount</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>

        {bookingStatus === "CONFIRMED" ? (
          <>
            <div
              className="alert alert-success"
              style={{ marginTop: 20 }}
            >
              ✅ This booking is already confirmed and paid.
            </div>

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 20 }}
              onClick={() =>
                navigate(`/receipt/${booking.id}`)
              }
            >
              View Receipt
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 24 }}
            onClick={() =>
              navigate(`/bookings/${booking.id}/payment`)
            }
          >
            Proceed to Payment
          </button>
        )}

      </div>
    </div>
  );
}
