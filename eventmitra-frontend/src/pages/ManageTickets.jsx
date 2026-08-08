import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createTicket,
  getTicketsByEvent,
  updateTicket,
} from "../api/ticketApi";

export default function ManageTickets() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticketId, setTicketId] = useState(null);

  const [form, setForm] = useState({
    ticketName: "",
    price: "",
    totalQuantity: "",
    availableQuantity: "",
  });

  useEffect(() => {
    loadTicket();
  }, []);

  async function loadTicket() {
    try {
      const res = await getTicketsByEvent(id);

      if (res.data.length > 0) {
        const ticket = res.data[0];

        setTicketId(ticket.id);

        setForm({
          ticketName: ticket.ticketName,
          price: ticket.price,
          totalQuantity: ticket.totalQuantity,
          availableQuantity: ticket.availableQuantity,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ticketName: form.ticketName,
      price: Number(form.price),
      totalQuantity: Number(form.totalQuantity),
      availableQuantity: Number(form.availableQuantity),
      eventId: Number(id),
    };

    try {
      if (ticketId) {
        await updateTicket(ticketId, payload);
        alert("Ticket updated successfully.");
      } else {
        await createTicket(payload);
        alert("Ticket created successfully.");
      }

      navigate("/organizer/my-events");
    } catch (err) {
      console.error(err);
      alert("Unable to save ticket.");
    }
  }

  return (
    <div className="container mt-4">
      <h2>Manage Ticket</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Ticket Name</label>
          <input
            type="text"
            className="form-control"
            name="ticketName"
            value={form.ticketName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Quantity</label>
          <input
            type="number"
            className="form-control"
            name="totalQuantity"
            value={form.totalQuantity}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Available Quantity</label>
          <input
            type="number"
            className="form-control"
            name="availableQuantity"
            value={form.availableQuantity}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <button className="btn btn-primary">
          {ticketId ? "Update Ticket" : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}