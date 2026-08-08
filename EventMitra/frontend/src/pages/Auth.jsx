import { CheckCircle2, Eye, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { eventImages } from "../data/mockData";

export function Register({ form, setForm, onRegister, setPage, message }) {
  return (
    <AuthShell title="Create Your Account" subtitle="Start booking and managing EventMitra tickets.">
      <form className="auth-form" onSubmit={onRegister}>
        <label>Full Name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Rahul Sharma" required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rahul@gmail.com" required /></label>
        <label>Mobile Number<input value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} placeholder="9876543210" required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required /></label>
        <label>Register As
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="ATTENDEE">Attendee</option>
            <option value="ORGANIZER">Organizer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        {message && <p className="form-message">{message}</p>}
        <button className="primary full">Register</button>
        <p className="switch-text">Already have an account? <button type="button" onClick={() => setPage("login")}>Login</button></p>
      </form>
    </AuthShell>
  );
}

export function Login({ form, setForm, onLogin, setPage, message }) {
  return (
    <AuthShell title="Welcome Back!" subtitle="Login to continue">
      <form className="auth-form" onSubmit={onLogin}>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rahul@gmail.com" required /></label>
        <label>Password
          <span className="password-field">
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
            <Eye size={16} />
          </span>
        </label>
        <button type="button" className="forgot">Forgot Password?</button>
        {message && <p className="form-message">{message}</p>}
        <button className="primary full">Login</button>
        <p className="switch-text">Do not have an account? <button type="button" onClick={() => setPage("register")}>Register</button></p>
      </form>
    </AuthShell>
  );
}

export function Otp({ otp, setOtp, mobile, onVerify, message }) {
  return (
    <main className="center-page">
      <section className="otp-card">
        <h1>Verify Your Mobile Number</h1>
        <p>We have sent an OTP to</p>
        <strong>{mobile || "+91 9876543210"}</strong>
        <label>Enter OTP</label>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input key={index} maxLength="1" value={digit} onChange={(e) => {
              const next = [...otp];
              next[index] = e.target.value.replace(/\D/g, "");
              setOtp(next);
            }} />
          ))}
        </div>
        <span className="timer">Resend OTP in 00:45</span>
        {message && <p className="form-message">{message}</p>}
        <button className="primary full" onClick={onVerify}>Verify OTP</button>
      </section>
    </main>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
        </div>
        <aside className="auth-aside" style={{ backgroundImage: `linear-gradient(180deg, rgba(7,18,40,.18), rgba(7,18,40,.94)), url(${eventImages.concert})` }}>
          <h2>Join EventMitra</h2>
          <p>Book tickets for the best events and experiences near you.</p>
          <ul>
            <li><CheckCircle2 size={16} /> Easy Booking</li>
            <li><ShieldCheck size={16} /> Secure Payments</li>
            <li><Phone size={16} /> Instant Confirmation</li>
            <li><Mail size={16} /> OTP Verification</li>
            <li><UserRound size={16} /> Role Based Access</li>
            <li><LockKeyhole size={16} /> JWT Protected APIs</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
