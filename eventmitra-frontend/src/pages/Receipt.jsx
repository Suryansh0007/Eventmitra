import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../api/baseUrl";
import { getBookingById } from "../api/bookingApi";
import { getReceiptByBooking } from "../api/receiptApi";
import { formatCurrency, formatDate, formatTime } from "../utils/format";
import "./Receipt.css";

export default function Receipt() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBookingById(id),
      getReceiptByBooking(id),
    ])
      .then(([bookingRes, receiptRes]) => {
        setBooking(bookingRes.data);
        setReceipt(receiptRes.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        Loading Receipt...
      </div>
    );
  }

  if (!booking || !receipt) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Receipt not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container receipt-page">

      <div className="receipt-card">

        <div className="receipt-header">
          <h1>EVENTMITRA</h1>
          <h3>Payment Receipt</h3>
        </div>

        <hr />

        {booking.event.imageUrl && (
          <img
            className="receipt-image"
            src={apiUrl(`/uploads/${booking.event.imageUrl}`)}
            alt={booking.event.eventName}
          />
        )}

        <div className="receipt-section">

          <div className="receipt-row">
            <span>Receipt Number</span>
            <strong>{receipt.receiptNumber}</strong>
          </div>

          <div className="receipt-row">
            <span>Booking ID</span>
            <strong>{booking.id}</strong>
          </div>

          <div className="receipt-row">
            <span>Event</span>
            <strong>{booking.event.eventName}</strong>
          </div>

          <div className="receipt-row">
            <span>Date</span>
            <strong>{formatDate(booking.event.eventDate)}</strong>
          </div>

          <div className="receipt-row">
            <span>Time</span>
            <strong>{formatTime(booking.event.startTime)}</strong>
          </div>

          <div className="receipt-row">
            <span>Venue</span>
            <strong>{booking.event.location}</strong>
          </div>

          <div className="receipt-row">
            <span>Ticket</span>
            <strong>{booking.ticket.ticketName}</strong>
          </div>

          <div className="receipt-row">
            <span>Quantity</span>
            <strong>{booking.numberOfTickets}</strong>
          </div>

          <div className="receipt-row">
            <span>Total Paid</span>
            <strong>{formatCurrency(booking.totalAmount)}</strong>
          </div>

          <div className="receipt-row">
            <span>Status</span>
            <strong className="success">SUCCESS</strong>
          </div>

        </div>

        <div className="receipt-footer">
          <p>Thank you for booking with EventMitra.</p>
          <p>Please carry a valid ID proof during the event.</p>
        </div>

        <div className="receipt-actions">

          <button
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>

          <Link
            className="btn btn-outline"
            to="/my-bookings"
          >
            My Bookings
          </Link>

        </div>

      </div>

    </div>
  );
}
