import { Filter, Search } from "lucide-react";
import EventCard from "../components/EventCard";

export default function Events({ events, openEvent, filters, setFilters }) {
  const filtered = events.filter((event) => {
    const q = filters.query.toLowerCase();
    const matchesSearch = !q || `${event.eventName} ${event.location} ${event.category}`.toLowerCase().includes(q);
    const matchesCategory = filters.category === "ALL" || event.category === filters.category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="page-wrap">
      <div className="page-title">
        <div>
          <h1>Events</h1>
          <p>Browse upcoming experiences and reserve tickets in a few steps.</p>
        </div>
      </div>
      <div className="toolbar">
        <label className="search-input">
          <Search size={17} />
          <input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="Search events" />
        </label>
        <label className="select-input">
          <Filter size={17} />
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option>ALL</option>
            <option>MUSIC</option>
            <option>WORKSHOP</option>
            <option>SPORTS</option>
            <option>TECH</option>
            <option>CONFERENCE</option>
            <option>CULTURAL</option>
          </select>
        </label>
      </div>
      <div className="event-grid">
        {filtered.map((event) => <EventCard key={event.id} event={event} onOpen={openEvent} />)}
      </div>
    </main>
  );
}
