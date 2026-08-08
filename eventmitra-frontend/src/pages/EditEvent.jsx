import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEventById,
  updateEvent,
  uploadEventImage,
} from "../api/eventApi";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "MUSIC",
    status: "UPCOMING",
    organizerId: "",
  });

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    try {
      const res = await getEventById(id);
      const e = res.data;

      setForm({
        eventName: e.eventName,
        description: e.description,
        eventDate: e.eventDate,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        category: e.category,
        status: e.status,
        organizerId: e.organizer.id,
      });
    } catch (err) {
      console.error(err);
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

    try {
      setLoading(true);

      // Update event using JSON
      await updateEvent(id, form);

      // Upload new image if selected
      if (image) {
        await uploadEventImage(id, image);
      }

      alert("Event Updated Successfully");
      navigate("/organizer/my-events");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to update event"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">

        <h2 className="mb-4">Edit Event</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              className="form-control"
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                className="form-control"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="MUSIC">Music</option>
              <option value="SPORTS">Sports</option>
              <option value="TECH">Tech</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="CONFERENCE">Conference</option>
              <option value="CULTURAL">Cultural</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Replace Event Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Event"}
          </button>

        </form>

      </div>
    </div>
  );
}