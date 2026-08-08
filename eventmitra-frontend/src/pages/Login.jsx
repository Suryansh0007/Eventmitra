import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: location.state?.email || "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="em-auth-page">
      <div className="em-auth-shell">
        <div className="em-auth-form-side">
          <h2>Welcome Back!</h2>
          <p className="sub">Login to continue</p>

          {location.state?.verified && (
            <div className="alert alert-success">Your account is verified — please log in.</div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={onSubmit}>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="form-label">Password</label>
              </div>
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

            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Logging in…" : "Login"}
            </button>
          </form>

          <div className="em-auth-switch">
            Don't have an account? <Link to="/register" className="link-pink">Register</Link>
          </div>
        </div>

        <div className="em-auth-promo">
          <h3>Join EventMitra</h3>
          <p>Book tickets for the best events and experiences near you.</p>
          <ul>
            <li>⚡ Easy Booking</li>
            <li>🔒 Secure Payments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
