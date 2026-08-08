import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getBookingsByAttendee } from "../api/bookingApi";
import { requestRefund } from "../api/refundApi";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate, bookingStatusBadgeClass } from "../utils/format";
import "./MyBookings.css";

export default function MyBookings() {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundingId, setRefundingId] = useState(null);
  const [notice, setNotice] = useState(location.state?.paid ? "Payment successful — booking confirmed!" : "");

  const load = () => {
    setLoading(true);
    getBookingsByAttendee(user.userId)
      .then((res) => {
        setBookings(res.data.sort((a, b) => b.id - a.id));
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load your bookings.");
        setLoading(false);
      });
  };

  useEffect(load, [user.userId]);

  const handleRefund = async (bookingId) => {
    const reason = window.prompt("Please tell us the reason for cancellation:");
    if (!reason) return;
    setRefundingId(bookingId);
    try {
      await requestRefund(bookingId, reason);
      setNotice("Refund request submitted. Our team will review it shortly.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not request a refund for this booking.");
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="container em-mybookings-page">
      <h2 className="section-title" style={{ marginBottom: 20 }}>
        My Bookings
      </h2>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="state-box">
          <div className="spinner" />
          Loading your bookings…
        </div>
      ) : bookings.length === 0 ? (
        <div className="state-box">
          You haven't booked any events yet.{" "}
          <Link to="/events" className="link-pink">
            Explore events
          </Link>
        </div>
      ) : (
        <div className="card em-mybookings-table-wrap">
          <table className="em-mybookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event</th>
                <th>Date</th>
                <th>Tickets</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>BKG{String(b.id).padStart(4, "0")}</td>
                  <td>{b.event.eventName}</td>
                  <td>{formatDate(b.event.eventDate)}</td>
                  <td>{b.numberOfTickets}</td>
                  <td>{formatCurrency(b.totalAmount)}</td>
                  <td>
                    <span className={`badge ${bookingStatusBadgeClass(b.bookingStatus)}`}>
                      {b.bookingStatus.charAt(0) + b.bookingStatus.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="em-mybookings-actions">
                    <Link to={`/bookings/${b.id}/summary`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                    {b.bookingStatus === "CONFIRMED" && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRefund(b.id)}
                        disabled={refundingId === b.id}
                      >
                        {refundingId === b.id ? "…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
