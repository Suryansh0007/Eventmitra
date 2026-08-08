import StatusBadge from "../components/StatusBadge";

export default function MyBookings({ bookings }) {
  return (
    <main className="page-wrap">
      <div className="page-title">
        <div>
          <h1>My Bookings</h1>
          <p>Track tickets, payment status, cancellations, and refund requests.</p>
        </div>
      </div>
      <section className="table-card">
        <table>
          <thead>
            <tr><th>Booking ID</th><th>Event</th><th>Date</th><th>Tickets</th><th>Amount</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.event}</td>
                <td>{booking.date}</td>
                <td>{booking.tickets}</td>
                <td>Rs. {booking.amount}</td>
                <td><StatusBadge status={booking.status} /></td>
                <td><button className="outline pink">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
