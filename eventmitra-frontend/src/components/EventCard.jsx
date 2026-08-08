import { Link } from "react-router-dom";
import { apiUrl } from "../api/baseUrl";
import { formatDate, categoryLabel } from "../utils/format";
import "./EventCard.css";

const GRADIENTS = [
  "linear-gradient(135deg,#3a1c71,#d76d77 60%,#ffaf7b)",
  "linear-gradient(135deg,#1e1e3f,#6a1fc2 55%,#ed1e63)",
  "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "linear-gradient(135deg,#41295a,#2f0743)",
  "linear-gradient(135deg,#280b45,#8f1f6b,#ed1e63)",
];

function gradientFor(id) {
  const idx = (Number(id) || 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export default function EventCard({ event, minPrice }) {
  return (
    <Link to={`/events/${event.id}`} className="em-event-card">

      {event.imageUrl ? (
        <img
          src={apiUrl(`/uploads/${event.imageUrl}`)}
          alt={event.eventName}
          className="em-event-thumb"
        />
      ) : (
        <div
          className="em-event-thumb"
          style={{ background: gradientFor(event.id) }}
        >
          <span className="em-event-thumb-badge">
            {categoryLabel(event.category)}
          </span>
        </div>
      )}

      <div className="em-event-card-body">
        <h4>{event.eventName}</h4>

        <div className="em-event-meta">
          <span>📍 {event.location}</span>
          <span>🗓 {formatDate(event.eventDate)}</span>
        </div>

        <div className="em-event-price">
          {minPrice != null
            ? `₹${minPrice.toLocaleString("en-IN")} onwards`
            : "View details"}
        </div>
      </div>

    </Link>
  );
}
