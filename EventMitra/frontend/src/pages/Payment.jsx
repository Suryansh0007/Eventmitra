import { BadgeCheck, CircleDot, ShieldCheck } from "lucide-react";

export default function Payment({ booking, event, payNow, message }) {
  return (
    <main className="page-wrap">
      <div className="page-title compact">
        <h1>Payment</h1>
      </div>
      <section className="payment-card">
        <div className="order-box">
          <h2>Order Details</h2>
          <div><span>Booking ID</span><strong>{booking?.id || "BKG0012"}</strong></div>
          <div><span>Event</span><strong>{event?.eventName}</strong></div>
          <div><span>Amount</span><strong>Rs. {booking?.amount || 6100}</strong></div>
        </div>
        <div className="order-box">
          <h2>Select Payment Method</h2>
          <label className="payment-option"><CircleDot size={18} /> Razorpay (Credit/Debit Card, UPI, Netbanking)</label>
          {message && <p className="form-message">{message}</p>}
          <button className="pay-button" onClick={payNow}>Pay Rs. {booking?.amount || 6100} Now</button>
          <p className="secure-note"><ShieldCheck size={17} /> 100% Secure Payments</p>
        </div>
        <div className="success-strip"><BadgeCheck size={18} /> You will be redirected to Razorpay secure gateway when backend credentials are configured.</div>
      </section>
    </main>
  );
}
