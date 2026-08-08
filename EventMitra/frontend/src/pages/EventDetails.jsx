import { CalendarDays, Clock, IndianRupee, MapPin, Minus, Plus, Tag } from "lucide-react";

export default function EventDetails({ event, tickets, quantities, setQuantities, startBooking }) {
  const selectedEvent = event || {};
  const total = tickets.reduce((sum, ticket) => sum + (quantities[ticket.id] || 0) * ticket.price, 0);

  function change(ticketId, delta) {
    setQuantities((current) => ({
      ...current,
      [ticketId]: Math.max(0, (current[ticketId] || 0) + delta)
    }));
  }

  return (
    <main className="page-wrap">
      <div className="page-title compact">
        <h1>Event Details</h1>
      </div>
      <section className="details-card">
        <img className="details-image" src={selectedEvent.image} alt={selectedEvent.eventName} />
        <div className="details-copy">
          <h2>{selectedEvent.eventName}</h2>
          <span className="pill">{selectedEvent.category}</span>
          <p><CalendarDays size={16} /> {selectedEvent.eventDate}</p>
          <p><Clock size={16} /> {selectedEvent.startTime}</p>
          <p><MapPin size={16} /> {selectedEvent.location}</p>
          <p className="description">{selectedEvent.description}</p>
        </div>
      </section>
      <section className="ticket-panel">
        <h2>Select Ticket Type</h2>
        {tickets.map((ticket) => (
          <div className="ticket-row" key={ticket.id}>
            <div>
              <strong>{ticket.ticketName}</strong>
              <p>{ticket.description}</p>
            </div>
            <span className="price"><IndianRupee size={14} />{ticket.price}</span>
            <span className="available">Available: {ticket.availableQuantity}</span>
            <div className="stepper">
              <button onClick={() => change(ticket.id, -1)}><Minus size={15} /></button>
              <span>{quantities[ticket.id] || 0}</span>
              <button onClick={() => change(ticket.id, 1)}><Plus size={15} /></button>
            </div>
          </div>
        ))}
        <div className="total-bar">
          <strong>Total Amount: <span>Rs. {total}</span></strong>
          <button className="primary" disabled={total === 0} onClick={startBooking}><Tag size={16} /> Book Now</button>
        </div>
      </section>
    </main>
  );
}
