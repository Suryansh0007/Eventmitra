import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, sendOtp } from "../api/authApi";
import "./Auth.css";

const ROLE_OPTIONS = [
  { value: "ATTENDEE", label: "Customer" },
  { value: "ORGANIZER", label: "Organizer" },
  { value: "ADMIN", label: "Admin" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "ATTENDEE",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        mobileNumber: form.mobileNumber,
        password: form.password,
        role: form.role,
      });
      // Kick off OTP verification so the account gets enabled
      await sendOtp(form.email).catch(() => {});
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="em-auth-page">
      <div className="em-auth-shell">
        <div className="em-auth-form-side">
          <h2>Create Your Account</h2>
          <p className="sub">Join EventMitra to start booking events.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Rahul Sharma"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="rahul@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                className="form-control"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={onChange}
                placeholder="9876543210"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="••••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Register As</label>
              <select className="form-control" name="role" value={form.role} onChange={onChange}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Creating account…" : "Register"}
            </button>
          </form>

          <div className="em-auth-switch">
            Already have an account? <Link to="/login" className="link-pink">Login</Link>
          </div>
        </div>

        <div className="em-auth-promo">
          <h3>Join EventMitra</h3>
          <p>Book tickets for the best events and experiences near you.</p>
          <ul>
            <li>⚡ Easy Booking</li>
            <li>🔒 Secure Payments</li>
            <li>✅ Instant Confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
