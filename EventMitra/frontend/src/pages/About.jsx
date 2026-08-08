import { BadgeIndianRupee, CalendarCheck, ShieldCheck, UsersRound } from "lucide-react";

export default function About() {
  return (
    <main className="page-wrap">
      <div className="page-title">
        <div>
          <h1>About EventMitra</h1>
          <p>A complete ticketing workspace for organizers, attendees, and admins.</p>
        </div>
      </div>
      <section className="about-grid">
        <article><CalendarCheck /><h2>Event Operations</h2><p>Create events, publish ticket slabs, and track bookings from one system.</p></article>
        <article><BadgeIndianRupee /><h2>Razorpay Payments</h2><p>Order creation, payment verification, receipts, and refund approval workflows.</p></article>
        <article><ShieldCheck /><h2>Secure Access</h2><p>JWT authentication, OTP verification, and role-based control for admin actions.</p></article>
        <article><UsersRound /><h2>Three User Roles</h2><p>Admin, organizer, and attendee workflows shaped around real ticket booking tasks.</p></article>
      </section>
    </main>
  );
}
