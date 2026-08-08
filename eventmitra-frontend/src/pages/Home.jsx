import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../api/eventApi";
import { getTicketsByEvent } from "../api/ticketApi";
import EventCard from "../components/EventCard";
import "./Home.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [minPrices, setMinPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getAllEvents()
      .then(async (res) => {
        if (!mounted) return;
        const upcoming = res.data.slice(0, 4);
        setEvents(upcoming);
        setLoading(false);

        // Best-effort fetch of ticket prices for the "onwards" price tag
        upcoming.forEach((ev) => {
          getTicketsByEvent(ev.id)
            .then((tres) => {
              const prices = tres.data.map((t) => t.price);
              if (prices.length && mounted) {
                setMinPrices((prev) => ({ ...prev, [ev.id]: Math.min(...prices) }));
              }
            })
            .catch(() => {});
        });
      })
      .catch(() => {
        if (mounted) {
          setError("Could not load events. Is the EventMitra backend running?");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <section className="em-hero">
        <div className="container em-hero-inner">
          <div className="em-hero-copy">
            <h1>
              Discover Amazing
              <br />
              <span className="em-hero-accent">Events</span> Near You
            </h1>
            <p>Book tickets for concerts, workshops, sports, and more.</p>
            <Link to="/events" className="btn btn-primary">
              Explore Events
            </Link>
          </div>
          <div className="em-hero-art">
            <div className="em-hero-art-glow" />
            <svg viewBox="0 0 400 220" className="em-hero-svg">
              <defs>
                <linearGradient id="stage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4fa3" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4b1fb0" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="400" height="220" fill="url(#stage)" opacity="0.15" />
              {[...Array(5)].map((_, i) => (
                <line
                  key={i}
                  x1={40 + i * 80}
                  y1="0"
                  x2={20 + i * 80}
                  y2="220"
                  stroke="#ffffff"
                  strokeOpacity="0.15"
                  strokeWidth="30"
                />
              ))}
              {[...Array(14)].map((_, i) => {
                const x = 15 + i * 28 + (i % 2 === 0 ? 4 : 0);
                const h = 34 + ((i * 37) % 40);
                return (
                  <g key={i}>
                    <circle cx={x} cy={220 - h - 12} r="7" fill="#14142b" />
                    <rect x={x - 6} y={220 - h} width="12" height={h} rx="4" fill="#14142b" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      <section className="container em-popular">
        <div className="em-popular-head">
          <h2 className="section-title">Popular Events</h2>
          <Link to="/events" className="link-pink">
            View All
          </Link>
        </div>

        {loading && (
          <div className="state-box">
            <div className="spinner" />
            Loading events…
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error" style={{ marginTop: 16 }}>
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="state-box">No events available right now. Check back soon!</div>
        )}

        {!loading && events.length > 0 && (
          <div className="em-event-grid">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} minPrice={minPrices[ev.id]} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
