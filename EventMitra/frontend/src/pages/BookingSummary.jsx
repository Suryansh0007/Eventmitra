import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";

export default function BookingSummary({ event, selectedTickets, setPage, confirmBooking }) {
  const ticketTotal = selectedTickets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const charges = selectedTickets.length ? 100 : 0;
  const total = ticketTotal + charges;

  return (
    <main className="page-wrap">
      <button className="back-button" onClick={() => setPage("details")}><ArrowLeft size={16} /> Booking Summary</button>
      <section className="summary-card">
        <div className="summary-event">
          <img src={event.image} alt={event.eventName} />
          <div>
            <h2>{event.eventName}</h2>
            <p><CalendarDays size={16} /> {event.eventDate}</p>
            <p><Clock size={16} /> {event.startTime}</p>
            <p><MapPin size={16} /> {event.location}</p>
          </div>
        </div>
        <h3>Ticket Details</h3>
        <div className="summary-table">
          <div className="summary-head"><span>Ticket Type</span><span>Price</span><span>Quantity</span><span>Subtotal</span></div>
          {selectedTickets.map((item) => (
            <div key={item.id}><span>{item.ticketName}</span><span>Rs. {item.price}</span><span>{item.quantity}</span><strong>Rs. {item.price * item.quantity}</strong></div>
          ))}
          <div><span>Booking Charges</span><span></span><span></span><strong>Rs. {charges}</strong></div>
          <div className="grand"><span>Total Amount</span><span></span><span></span><strong>Rs. {total}</strong></div>
        </div>
        <button className="primary summary-action" onClick={() => confirmBooking(total)}>Proceed to Payment</button>
      </section>
    </main>
  );
}
