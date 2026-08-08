import { BarChart3, CalendarDays, CreditCard, Gauge, Layers, LogOut, ReceiptText, RefreshCw, Ticket, Users } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { adminRows } from "../data/mockData";

export default function AdminDashboard({ setPage }) {
  const nav = [
    [Gauge, "Dashboard"],
    [Users, "Users"],
    [CalendarDays, "Events"],
    [Ticket, "Bookings"],
    [CreditCard, "Payments"],
    [RefreshCw, "Refunds"],
    [Layers, "Categories"]
  ];

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <button className="brand admin-brand" onClick={() => setPage("home")}>
          <span className="brand-mark"><CalendarDays size={16} /></span>
          <span>EventMitra</span>
        </button>
        <nav>
          {nav.map(([Icon, label], index) => (
            <button key={label} className={index === 0 ? "selected" : ""}><Icon size={16} /> {label}</button>
          ))}
          <button onClick={() => setPage("home")}><LogOut size={16} /> Logout</button>
        </nav>
      </aside>
      <section className="admin-main">
        <header className="admin-top">
          <button className="ghost"><BarChart3 size={18} /></button>
          <span>Admin</span>
        </header>
        <div className="admin-content">
          <h1>Admin Dashboard</h1>
          <div className="stats-grid">
            <Stat title="Total Users" value="1250" note="+15 this month" icon={<Users />} />
            <Stat title="Total Events" value="86" note="+8 this month" icon={<CalendarDays />} />
            <Stat title="Total Bookings" value="1523" note="+20 this month" icon={<Ticket />} />
            <Stat title="Total Revenue" value="Rs. 12,45,300" note="+18% this month" icon={<ReceiptText />} green />
          </div>
          <section className="table-card admin-table">
            <div className="section-heading in-card">
              <h2>Recent Bookings</h2>
              <button className="link-button">View All</button>
            </div>
            <table>
              <thead>
                <tr><th>Booking ID</th><th>User</th><th>Event</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {adminRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.user}</td>
                    <td>{row.event}</td>
                    <td>Rs. {row.amount}</td>
                    <td><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </main>
  );
}

function Stat({ title, value, note, icon, green }) {
  return (
    <article className="stat-card">
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <p className={green ? "green" : ""}>{note}</p>
      </div>
      <div className={green ? "stat-icon green-bg" : "stat-icon"}>{icon}</div>
    </article>
  );
}
