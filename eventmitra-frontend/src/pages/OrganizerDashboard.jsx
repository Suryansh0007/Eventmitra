import { useEffect, useState } from "react";
import { getOrganizerDashboard } from "../api/organizerDashboardApi";
import "./OrganizerDashboard.css";

export default function OrganizerDashboard() {

    const [dashboard, setDashboard] = useState({
        myEvents: 0,
        ticketsSold: 0,
        revenue: 0,
        upcomingEvents: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getOrganizerDashboard();
            setDashboard(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-container">

            <h2 className="dashboard-title">
                Organizer Dashboard
            </h2>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h3>My Events</h3>
                    <p>{dashboard.myEvents}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Tickets Sold</h3>
                    <p>{dashboard.ticketsSold}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Revenue</h3>
                    <p>₹ {dashboard.revenue}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Upcoming Events</h3>
                    <p>{dashboard.upcomingEvents}</p>
                </div>

            </div>

        </div>
    );
}