import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";



function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        bookedAppointments: 0,
        cancelledAppointments: 0
    });

    const logout = () => {

        localStorage.removeItem("token");
localStorage.removeItem("role");
        navigate("/");

    };

    const loadStats = async () => {

        try {

            const response = await api.get("/api/admin/dashboard");

            setStats(response.data);

        } catch (error) {

            toast.error("Unable to load dashboard");

        }

    };

    useEffect(() => {

        loadStats();

    }, []);

    return (

        <div className="container mt-5">

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h2 className="fw-bold">
                        Welcome Admin 👋
                    </h2>

                    <p className="text-muted mb-0">
                        Manage the Healthcare Appointment Management System.
                    </p>

                </div>

            </div>
            <div className="row mb-4">

    <div className="col-md">
        <div className="card text-center shadow">
            <div className="card-body">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
            </div>
        </div>
    </div>

    <div className="col-md">
        <div className="card text-center shadow">
            <div className="card-body">
                <h3>{stats.totalDoctors}</h3>
                <p>Total Doctors</p>
            </div>
        </div>
    </div>

    <div className="col-md">
        <div className="card text-center shadow">
            <div className="card-body">
                <h3>{stats.totalAppointments}</h3>
                <p>Total Appointments</p>
            </div>
        </div>
    </div>

    <div className="col-md">
        <div className="card text-center shadow">
            <div className="card-body">
                <h3>{stats.bookedAppointments}</h3>
                <p>Booked</p>
            </div>
        </div>
    </div>

    <div className="col-md">
        <div className="card text-center shadow">
            <div className="card-body">
                <h3>{stats.cancelledAppointments}</h3>
                <p>Cancelled</p>
            </div>
        </div>
    </div>

</div>

            <div className="row">

                <div className="col-md-3 mb-3">

                    <div className="card shadow h-100 text-center">

                        <div className="card-body">

                            <h1>👨‍⚕️</h1>

                            <h5>Manage Doctors</h5>

                            <button
                                className="btn btn-warning mt-3"
                                onClick={() => navigate("/doctors")}
                            >
                                Open
                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow h-100 text-center">

                        <div className="card-body">

                            <h1>👥</h1>

                            <h5>Manage Users</h5>

                            <button
                                className="btn btn-primary mt-3"
                                onClick={() => navigate("/users")}
                            >
                                Open
                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow h-100 text-center">

                        <div className="card-body">

                            <h1>📅</h1>

                            <h5>All Appointments</h5>

                            <button
                                className="btn btn-primary mt-3"
                                onClick={() => navigate("/appointments")}
                            >
                                Open
                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow h-100 text-center">

                        <div className="card-body">

                            <h1>🚪</h1>

                            <h5>Logout</h5>

                            <button
                                className="btn btn-danger mt-3"
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default AdminDashboard;