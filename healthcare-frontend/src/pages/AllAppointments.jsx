import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function AllAppointments() {

    const [appointments, setAppointments] = useState([]);

    const loadAppointments = async () => {

        try {

            const response = await api.get("/api/admin/appointments");

            setAppointments(response.data);

        } catch (error) {

            toast.error("Unable to load appointments");

        }

    };

    useEffect(() => {

        loadAppointments();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                All Appointments
            </h2>

            <table className="table table-bordered table-hover">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Patient</th>
                        <th>Email</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {appointments.map(appointment => (

                        <tr key={appointment.id}>

                            <td>{appointment.id}</td>

                            <td>{appointment.patientName}</td>

                            <td>{appointment.patientEmail}</td>

                            <td>{appointment.doctorName}</td>

                            <td>{appointment.appointmentDate}</td>

                            <td>{appointment.slot.substring(0, 5)}</td>

                            <td>

                                <span
                                    className={`badge ${
                                        appointment.status === "BOOKED"
                                            ? "bg-success"
                                            : "bg-danger"
                                    }`}
                                >
                                    {appointment.status}
                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default AllAppointments;