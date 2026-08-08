import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, uploadEventImage } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import "./CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "MUSIC",
    status: "UPCOMING",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        eventName: form.eventName,
        description: form.description,
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        category: form.category,
        status: form.status,
        organizerId: user.userId,
      };

      const response = await createEvent(payload);

      if (image) {
        await uploadEventImage(response.data.id, image);
      }

      alert("Event Created Successfully");

      navigate("/organizer/my-events");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Unable to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">

      <div className="create-event-card">

        <div className="page-header">

          <h2>Create New Event</h2>

          <p>
            Publish your event and start selling tickets.
          </p>

        </div>

        <form onSubmit={submitHandler}>

          <div className="section-title">
            Event Information
          </div>

          <div className="form-group">

            <label>Event Name</label>

            <input
              type="text"
              className="form-control"
              name="eventName"
              value={form.eventName}
              onChange={changeHandler}
              placeholder="Enter event name"
              required
            />

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              rows="5"
              className="form-control"
              name="description"
              value={form.description}
              onChange={changeHandler}
              placeholder="Describe your event..."
              required
            />

          </div>

          <div className="row">

            <div className="col-md-6">

              <div className="form-group">

                <label>Event Date</label>

                <input
                  type="date"
                  className="form-control"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={changeHandler}
                  required
                />

              </div>

            </div>

            <div className="col-md-6">

              <div className="form-group">

                <label>Category</label>

                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={changeHandler}
                >
                  <option value="MUSIC">Music</option>
                  <option value="SPORTS">Sports</option>
                  <option value="TECH">Tech</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="CULTURAL">Cultural</option>
                </select>

              </div>

            </div>

          </div>

          <div className="row">

            <div className="col-md-6">

              <div className="form-group">

                <label>Start Time</label>

                <input
                  type="time"
                  className="form-control"
                  name="startTime"
                  value={form.startTime}
                  onChange={changeHandler}
                  required
                />

              </div>

            </div>

            <div className="col-md-6">

              <div className="form-group">

                <label>End Time</label>

                <input
                  type="time"
                  className="form-control"
                  name="endTime"
                  value={form.endTime}
                  onChange={changeHandler}
                  required
                />

              </div>

            </div>

          </div>

          <div className="form-group">

            <label>Location</label>

            <input
              type="text"
              className="form-control"
              name="location"
              value={form.location}
              onChange={changeHandler}
              placeholder="Enter event location"
              required
            />

          </div>

          <div className="section-title mt-4">
            Event Banner
          </div>

          <div className="upload-box">

            <input
              type="file"
              accept="image/*"
              onChange={imageHandler}
            />

            <p>
              Choose an event image
            </p>

          </div>

          {preview && (

            <div className="preview-container">

              <img
                src={preview}
                alt="Preview"
                className="preview-image"
              />

            </div>

          )}

          <div className="button-container">

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}