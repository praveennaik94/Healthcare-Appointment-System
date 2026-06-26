import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";


function MyAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [reschedule, setReschedule] = useState({
        appointmentDate: "",
        slot: ""
    });

    const [slots, setSlots] = useState([]);

    const loadAppointments = async () => {

        try {

            const response = await api.get("/api/appointments");

            setAppointments(response.data);

        } catch (error) {

            toast.error("Unable to fetch appointments");

        }

    };

    const searchAppointments = async () => {

        if (search.trim() === "") {
            loadAppointments();
            return;
        }

        try {

            const response = await api.get(
                "/api/appointments/search",
                {
                    params: {
                        doctorName: search
                    }
                }
            );

            setAppointments(response.data);

        } catch (error) {

            toast.error("Search failed");

        }

    };

    const openReschedule = (appointment) => {

        setSelectedAppointment(appointment);

        setReschedule({
            appointmentDate: appointment.appointmentDate,
            slot: ""
        });

        setSlots([]);

        setShowModal(true);

    };

    const loadAvailableSlots = async () => {

        try {

            const response = await api.get(
                "/api/appointments/slots",
                {
                    params: {
                        doctorName: selectedAppointment.doctorName,
                        date: reschedule.appointmentDate
                    }
                }
            );

            setSlots(response.data);

        } catch (error) {

            toast.error("Unable to load slots");

        }

    };

    const updateAppointment = async () => {

        if (!reschedule.slot) {
            toast.warning("Please select a slot");
            return;
        }

        try {

            await api.put(
                `/api/appointments/${selectedAppointment.id}/reschedule`,
                reschedule
            );

            toast.success("Appointment Rescheduled Successfully");

            setShowModal(false);

            setSlots([]);

            setSelectedAppointment(null);

            setReschedule({
                appointmentDate: "",
                slot: ""
            });

            loadAppointments();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to reschedule appointment"
            );

        }

    };

    useEffect(() => {

        loadAppointments();

    }, []);

    useEffect(() => {

        searchAppointments();

    }, [search]);

    const cancelAppointment = async (id) => {

        if (!window.confirm("Cancel this appointment?")) {
            return;
        }

        try {

            await api.delete(`/api/appointments/${id}`);

            toast.success("Appointment Cancelled");

            if (search.trim() === "") {
                loadAppointments();
            } else {
                searchAppointments();
            }

        } catch (error) {

            toast.error("Cancellation Failed");

        }

    };

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                My Appointments
            </h2>

            <input
                className="form-control mb-3"
                placeholder="Search Doctor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="table table-bordered table-hover">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {appointments.length === 0 ? (

                        <tr>
                            <td colSpan="6" className="text-center">
                                No appointments found
                            </td>
                        </tr>

                    ) : (

                        appointments.map((appointment) => (

                            <tr key={appointment.id}>

                                <td>{appointment.id}</td>
                                <td>{appointment.doctorName}</td>
                                <td>{appointment.appointmentDate}</td>
                                <td>{appointment.slot.substring(0, 5)}</td>

                                <td>
                                    <span
                                        className={`badge ${appointment.status === "BOOKED"
                                            ? "bg-success"
                                            : "bg-danger"
                                            }`}
                                    >
                                        {appointment.status}
                                    </span>
                                </td>

                                <td>

                                    {appointment.status === "BOOKED" && (

                                        <>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => openReschedule(appointment)}
                                            >
                                                Reschedule
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    cancelAppointment(appointment.id)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </>

                                    )}

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

            {showModal && (

                <div
                    className="modal d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Reschedule Appointment
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />

                            </div>

                            <div className="modal-body">

                                <label>New Date</label>

                                <input
                                    type="date"
                                    className="form-control mb-3"
                                    value={reschedule.appointmentDate}
                                    onChange={(e) =>
                                        setReschedule({
                                            ...reschedule,
                                            appointmentDate: e.target.value
                                        })
                                    }
                                />

                                <button
                                    className="btn btn-secondary mb-3"
                                    onClick={loadAvailableSlots}
                                >
                                    Load Available Slots
                                </button>

                                <div>

                                    {slots.map((slot, index) => (

                                        <button
                                            key={index}
                                            type="button"
                                            className={`btn m-1 ${reschedule.slot === slot
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                                }`}
                                            onClick={() =>
                                                setReschedule((prev) => ({
                                                    ...prev,
                                                    slot
                                                }))
                                            }
                                        >
                                            {slot.substring(0, 5)}
                                        </button>

                                    ))}

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={updateAppointment}
                                >
                                    Update Appointment
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default MyAppointments;