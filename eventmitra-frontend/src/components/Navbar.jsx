import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="em-navbar">
      <div className="container em-navbar-inner">
        <Link to="/" className="em-logo">
          <span className="em-logo-mark">◈</span> EventMitra
        </Link>

        <nav className={`em-nav-links ${menuOpen ? "open" : ""}`}>
          {/* Public */}
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/events" onClick={closeMenu}>
            Events
          </NavLink>

          {/* ATTENDEE */}
          {user?.role === "ATTENDEE" && (
            <>
              <NavLink to="/my-bookings" onClick={closeMenu}>
                My Bookings
              </NavLink>
            </>
          )}

          {/* ORGANIZER */}
          {user?.role === "ORGANIZER" && (
            <>
              <NavLink to="/organizer" onClick={closeMenu}>
                Dashboard
              </NavLink>

              <NavLink
                to="/organizer/create-event"
                onClick={closeMenu}
              >
                Create Event
              </NavLink>

              <NavLink
                to="/organizer/my-events"
                onClick={closeMenu}
              >
                My Events
              </NavLink>
            </>
          )}

          {/* ADMIN */}
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin" onClick={closeMenu}>
                Dashboard
              </NavLink>
            </>
          )}
        </nav>

        <div className="em-navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="em-user-pill">
                Hi, {user.fullName?.split(" ")[0] || user.email}
              </span>

              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline btn-sm"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary btn-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="em-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}