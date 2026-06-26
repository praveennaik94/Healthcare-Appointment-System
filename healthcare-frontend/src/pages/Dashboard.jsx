import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalAppointments: 0,
        bookedAppointments: 0,
        cancelledAppointments: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {

        try {

            const response = await api.get(
                "/api/appointments/dashboard"
            );

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    const logout = () => {

        localStorage.removeItem("token");
        navigate("/");

    };

    return (

    <div className="container mt-5">

        {/* Welcome Card */}

        <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

                <h2 className="fw-bold">
                    Welcome 👋
                </h2>

                <p className="text-muted mb-0">
                    Manage your healthcare appointments quickly and easily.
                </p>

            </div>

        </div>

        <h3 className="text-center mb-4">
            Healthcare Appointment Dashboard
        </h3>

        <div className="row">

            <div className="col-md-3 mb-3">

                <div className="card text-white bg-primary shadow h-100 text-center">

                    <div className="card-body">

                        <h1>📋</h1>

                        <h5>Total Appointments</h5>

                        <h2>{stats.totalAppointments}</h2>

                    </div>

                </div>

            </div>

            <div className="col-md-3 mb-3">

                <div className="card text-white bg-success shadow h-100 text-center">

                    <div className="card-body">

                        <h1>✅</h1>

                        <h5>Booked</h5>

                        <h2>{stats.bookedAppointments}</h2>

                    </div>

                </div>

            </div>

            <div className="col-md-3 mb-3">

                <div className="card text-white bg-danger shadow h-100 text-center">

                    <div className="card-body">

                        <h1>❌</h1>

                        <h5>Cancelled</h5>

                        <h2>{stats.cancelledAppointments}</h2>

                    </div>

                </div>

            </div>

            <div className="col-md-3 mb-3">

                <div className="card shadow h-100 text-center">

                    <div className="card-body">

                        <h1>🚪</h1>

                        <h5>Logout</h5>

                        <button
                            className="btn btn-danger mt-2"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>

        <div className="row mt-4">

    <div className="col-md-4 mb-3">

        <div className="card shadow h-100">

            <div className="card-body text-center">

                <h1>👨‍⚕️</h1>

                <h4>Book Appointment</h4>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/book")}
                >
                    Open
                </button>

            </div>

        </div>

    </div>

    <div className="col-md-4 mb-3">

        <div className="card shadow h-100">

            <div className="card-body text-center">

                <h1>📅</h1>

                <h4>My Appointments</h4>

                <button
                    className="btn btn-success mt-3"
                    onClick={() => navigate("/appointments")}
                >
                    View
                </button>

            </div>

        </div>

    </div>

    <div className="col-md-4 mb-3">

        <div className="card shadow h-100">

            <div className="card-body text-center">

                <h1>🩺</h1>

                <h4>Manage Doctors</h4>

                <button
                    className="btn btn-warning mt-3 w-100"
                    onClick={() => navigate("/doctors")}
                >
                    Manage Doctors
                </button>

            </div>

        </div>

    </div>

</div>

    </div>

);
}

export default Dashboard;