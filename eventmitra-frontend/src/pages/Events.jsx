import { useEffect, useMemo, useState } from "react";
import { getAllEvents } from "../api/eventApi";
import EventCard from "../components/EventCard";
import "./Events.css";

const CATEGORIES = ["ALL", "MUSIC", "WORKSHOP", "SPORTS", "TECH", "CONFERENCE", "CULTURAL"];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllEvents()
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load events. Is the EventMitra backend running?");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory = category === "ALL" || ev.category === category;
      const matchesSearch =
        !search ||
        ev.eventName.toLowerCase().includes(search.toLowerCase()) ||
        ev.location.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, category, search]);

  return (
    <div className="container em-events-page">
      <div className="em-events-head">
        <h2 className="section-title">Explore Events</h2>
        <input
          className="form-control em-events-search"
          placeholder="Search by event or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="em-category-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`em-tab ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c.charAt(0) + c.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          Loading events…
        </div>
      )}

      {!loading && error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="state-box">No events match your search.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="em-event-grid">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
}
