import { Calendar, IndianRupee, MapPin } from "lucide-react";

export default function EventCard({ event, onOpen }) {
  const date = event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "Date TBA";

  return (
    <article className="event-card">
      <img src={event.image} alt={event.eventName} />
      <div className="event-card-body">
        <h3>{event.eventName}</h3>
        <p><MapPin size={13} /> {event.location}</p>
        <p><Calendar size={13} /> {date}</p>
        <strong><IndianRupee size={13} />{event.price || 0} onwards</strong>
        <button className="card-action" onClick={() => onOpen(event)}>View</button>
      </div>
    </article>
  );
}
