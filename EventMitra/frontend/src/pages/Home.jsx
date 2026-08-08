import { ArrowRight, Search } from "lucide-react";
import EventCard from "../components/EventCard";
import { eventImages } from "../data/mockData";

export default function Home({ events, setPage, openEvent }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Live booking platform</span>
          <h1>Discover Amazing <span>Events</span> Near You</h1>
          <p>Book tickets for concerts, workshops, sports, conferences, food festivals, and cultural nights.</p>
          <div className="search-shell">
            <Search size={18} />
            <input placeholder="Search event, city, category" />
            <button onClick={() => setPage("events")}>Explore <ArrowRight size={16} /></button>
          </div>
        </div>
        <div className="hero-media">
          <img src={eventImages.concert} alt="Concert crowd with stage lighting" />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Popular Events</h2>
            <p>Fast-selling experiences curated for this week.</p>
          </div>
          <button className="link-button" onClick={() => setPage("events")}>View All</button>
        </div>
        <div className="event-grid">
          {events.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} onOpen={openEvent} />
          ))}
        </div>
      </section>
    </>
  );
}
