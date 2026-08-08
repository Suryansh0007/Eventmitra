import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../api/userApi";
import { getAllEvents } from "../api/eventApi";
import { getAllBookings } from "../api/bookingApi";
import { getAllPayments } from "../api/paymentApi";
import { getRequestedRefunds, approveRefund, rejectRefund } from "../api/refundApi";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate, bookingStatusBadgeClass } from "../utils/format";
import "./AdminDashboard.css";

const TABS = ["Dashboard", "Users", "Events", "Bookings", "Payments", "Refunds"];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Dashboard");

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadAll = () => {
    setLoading(true);
    Promise.allSettled([getAllUsers(), getAllEvents(), getAllBookings(), getAllPayments(), getRequestedRefunds()]).then(
      ([u, e, b, p, r]) => {
        if (u.status === "fulfilled") setUsers(u.value.data);
        if (e.status === "fulfilled") setEvents(e.value.data);
        if (b.status === "fulfilled") setBookings(b.value.data.sort((a, c) => c.id - a.id));
        if (p.status === "fulfilled") setPayments(p.value.data);
        if (r.status === "fulfilled") setRefunds(r.value.data);
        if ([u, e, b, p, r].some((x) => x.status === "rejected")) {
          setError("Some admin data could not be loaded — check that you're logged in as an ADMIN.");
        }
        setLoading(false);
      }
    );
  };

  useEffect(loadAll, []);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleApprove = async (refundId) => {
    setBusyId(refundId);
    try {
      await approveRefund(refundId);
      loadAll();
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (refundId) => {
    setBusyId(refundId);
    try {
      await rejectRefund(refundId);
      loadAll();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="em-admin-shell">
      <aside className="em-admin-sidebar">
        <div className="em-admin-logo">◈ EventMitra</div>
        <nav>
          {TABS.map((t) => (
            <button key={t} className={`em-admin-nav-item ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <button
          className="em-admin-nav-item em-admin-logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="em-admin-main">
        <div className="em-admin-topbar">
          <h2>{tab === "Dashboard" ? "Admin Dashboard" : tab}</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="state-box">
            <div className="spinner" />
            Loading admin data…
          </div>
        ) : (
          <>
            {tab === "Dashboard" && (
              <>
                <div className="em-admin-stats">
                  <StatCard label="Total Users" value={users.length} />
                  <StatCard label="Total Events" value={events.length} />
                  <StatCard label="Total Bookings" value={bookings.length} />
                  <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} />
                </div>

                <div className="card em-admin-table-card">
                  <div className="em-admin-table-head">
                    <h3>Recent Bookings</h3>
                  </div>
                  <BookingsTable bookings={bookings.slice(0, 8)} />
                </div>
              </>
            )}

            {tab === "Users" && (
              <div className="card em-admin-table-card">
                <table className="em-admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.mobileNumber}</td>
                        <td>{u.role}</td>
                        <td>
                          <span className={`badge ${u.enabled ? "badge-green" : "badge-amber"}`}>
                            {u.enabled ? "Active" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "Events" && (
              <div className="card em-admin-table-card">
                <table className="em-admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td>{ev.id}</td>
                        <td>{ev.eventName}</td>
                        <td>{ev.category}</td>
                        <td>{formatDate(ev.eventDate)}</td>
                        <td>{ev.location}</td>
                        <td>{ev.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "Bookings" && (
              <div className="card em-admin-table-card">
                <BookingsTable bookings={bookings} />
              </div>
            )}

            {tab === "Payments" && (
              <div className="card em-admin-table-card">
                <table className="em-admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Booking ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Razorpay Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.booking?.id}</td>
                        <td>{formatCurrency(p.amount)}</td>
                        <td>
                          <span className={`badge ${p.paymentStatus === "SUCCESS" ? "badge-green" : "badge-red"}`}>
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td>{p.razorpayOrderId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "Refunds" && (
              <div className="card em-admin-table-card">
                {refunds.length === 0 ? (
                  <div className="state-box">No pending refund requests.</div>
                ) : (
                  <table className="em-admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Booking ID</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refunds.map((r) => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.booking?.id}</td>
                          <td>{formatCurrency(r.refundAmount)}</td>
                          <td>{r.reason}</td>
                          <td className="em-mybookings-actions">
                            <button
                              className="btn btn-success btn-sm"
                              disabled={busyId === r.id}
                              onClick={() => handleApprove(r.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              disabled={busyId === r.id}
                              onClick={() => handleReject(r.id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card em-stat-card">
      <div className="em-stat-label">{label}</div>
      <div className="em-stat-value">{value}</div>
    </div>
  );
}

function BookingsTable({ bookings }) {
  if (bookings.length === 0) {
    return <div className="state-box">No bookings yet.</div>;
  }
  return (
    <table className="em-admin-table">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>User</th>
          <th>Event</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id}>
            <td>BKG{String(b.id).padStart(4, "0")}</td>
            <td>{b.attendee?.fullName}</td>
            <td>{b.event?.eventName}</td>
            <td>{formatCurrency(b.totalAmount)}</td>
            <td>
              <span className={`badge ${bookingStatusBadgeClass(b.bookingStatus)}`}>{b.bookingStatus}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
