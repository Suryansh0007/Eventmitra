import { CalendarDays, LogOut, MapPin, Menu, UserRound } from "lucide-react";
import { clearToken, getToken } from "../services/api";

export default function Header({ page, setPage, user, setUser }) {
  const nav = [
    ["home", "Home"],
    ["events", "Events"],
    ["bookings", "My Bookings"],
    ["about", "About Us"]
  ];

  function logout() {
    clearToken();
    setUser(null);
    setPage("home");
  }

  return (
    <header className="topbar">
      <button className="brand" onClick={() => setPage("home")} aria-label="EventMitra home">
        <span className="brand-mark"><CalendarDays size={16} /></span>
        <span>EventMitra</span>
      </button>
      <nav className="nav-links" aria-label="Primary navigation">
        {nav.map(([key, label]) => (
          <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="top-actions">
        <span className="location"><MapPin size={15} /> Pune</span>
        {getToken() ? (
          <>
            <button className="ghost icon-label" onClick={() => setPage(user?.role === "ADMIN" ? "admin" : "profile")}>
              <UserRound size={16} /> {user?.role || "Account"}
            </button>
            <button className="outline icon-only" onClick={logout} aria-label="Logout"><LogOut size={16} /></button>
          </>
        ) : (
          <>
            <button className="outline" onClick={() => setPage("login")}>Login</button>
            <button className="primary small" onClick={() => setPage("register")}>Register</button>
          </>
        )}
        <button className="menu-button" aria-label="Open menu"><Menu size={20} /></button>
      </div>
    </header>
  );
}
