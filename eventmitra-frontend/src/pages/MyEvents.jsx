import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import "./MyEvents.css";

export default function MyEvents() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const res = await getAllEvents();

      const myEvents = res.data.filter(
        (event) => event.organizer?.id === user.userId
      );

      setEvents(myEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.eventName.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const badgeClass = (status) => {
    switch (status) {
      case "UPCOMING":
        return "badge bg-success";
      case "COMPLETED":
        return "badge bg-secondary";
      case "CANCELLED":
        return "badge bg-danger";
      default:
        return "badge bg-primary";
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h5>Loading...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>My Events</h2>
          <p>Manage all your events.</p>
        </div>

        <Link
          to="/organizer/create-event"
          className="btn btn-primary"
        >
          + Create Event
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search event..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredEvents.length === 0 ? (
        <div className="alert alert-info">
          No events found.
        </div>
      ) : (
        <table className="table table-bordered table-hover">

          <thead className="table-light">
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredEvents.map((event) => (

              <tr key={event.id}>

                <td>{event.eventName}</td>

                <td>{event.eventDate}</td>

                <td>{event.location}</td>

                <td>
                  <span className={badgeClass(event.status)}>
                    {event.status}
                  </span>
                </td>

                <td>

                  <Link
                    to={`/organizer/edit-event/${event.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/organizer/manage-tickets/${event.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Tickets
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}