import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../api/bookingApi";
import { createOrder, verifyPayment } from "../api/paymentApi";
import { formatCurrency } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import "./Payment.css";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getBookingById(id)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load this booking.");
        setLoading(false);
      });
  }, [id]);

  const handlePay = async () => {
    setError("");
    setPaying(true);
    try {
      const orderRes = await createOrder(Number(id));
      const { razorpayOrderId, amount, currency, keyId } = orderRes.data;

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        setError("Could not load the Razorpay checkout script. Check your internet connection.");
        setPaying(false);
        return;
      }

      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency,
        name: "EventMitra",
        description: booking.event.eventName,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.fullName,
          email: user?.email,
        },
        theme: { color: "#ed1e63" },
        handler: async (response) => {
          try {
            await verifyPayment({
              bookingId: Number(id),
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate(`/my-bookings`, { state: { paid: true } });
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment. Please try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        Loading order…
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: "40px 24px" }}>
        <div className="alert alert-error">{error || "Booking not found."}</div>
      </div>
    );
  }

  return (
    <div className="container em-payment-page">
      <Link to={`/bookings/${id}/summary`} className="em-back-link">
        ← Payment
      </Link>

      <div className="card em-payment-card">
        <h3>Order Details</h3>
        <div className="em-payment-row">
          <span>Booking ID</span>
          <strong>BKG{String(booking.id).padStart(4, "0")}</strong>
        </div>
        <div className="em-payment-row">
          <span>Event</span>
          <strong>{booking.event.eventName}</strong>
        </div>
        <div className="em-payment-row">
          <span>Amount</span>
          <strong>{formatCurrency(booking.totalAmount)}</strong>
        </div>

        <h3 style={{ marginTop: 26 }}>Select Payment Method</h3>
        <div className="em-payment-method">
          <span className="em-radio-dot" />
          Razorpay (Credit/Debit Card, UPI, Netbanking)
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-success btn-block em-pay-btn" onClick={handlePay} disabled={paying}>
          {paying ? "Processing…" : `Pay ${formatCurrency(booking.totalAmount)} Now`}
        </button>

        <div className="em-payment-secure">🔒 You will be redirected to Razorpay secure gateway.</div>
        <div className="em-payment-secure">🛡️ 100% Secure Payments</div>
      </div>
    </div>
  );
}
