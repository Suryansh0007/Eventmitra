import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../api/authApi";
import "./Auth.css";

const LENGTH = 6;
const RESEND_SECONDS = 45;

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  if (!email) {
    return (
      <div className="em-auth-page">
        <div className="card" style={{ padding: 32, maxWidth: 420, textAlign: "center" }}>
          <p>No email found for verification.</p>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  const handleDigit = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[idx] = value;
    setDigits(next);
    if (value && idx < LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      await sendOtp(email);
      setSeconds(RESEND_SECONDS);
      setSuccess("OTP resent successfully.");
    } catch {
      setError("Could not resend OTP. Please try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await verifyOtp(email, otp);
      navigate("/login", { state: { verified: true, email } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="em-auth-page">
      <div className="card" style={{ padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center" }}>
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>Verify Your Mobile Number</h2>
        <p className="text-gray" style={{ fontSize: 13.5 }}>
          We have sent an OTP to
          <br />
          <strong>{email}</strong>
        </p>

        {error && <div className="alert alert-error" style={{ marginTop: 18, textAlign: "left" }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginTop: 18, textAlign: "left" }}>{success}</div>}

        <form onSubmit={handleVerify}>
          <label className="form-label" style={{ display: "block", marginTop: 20 }}>
            Enter OTP
          </label>
          <div className="em-otp-row">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                className="em-otp-box"
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
              />
            ))}
          </div>

          <div className="em-otp-resend">
            {seconds > 0 ? (
              <>Resend OTP in 00:{String(seconds).padStart(2, "0")}</>
            ) : (
              <button type="button" className="link-pink" style={{ background: "none", border: "none" }} onClick={handleResend}>
                Resend OTP
              </button>
            )}
          </div>

          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Verifying…" : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
