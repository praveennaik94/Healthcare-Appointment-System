import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function BookAppointment() {

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    doctorName: "",
    appointmentDate: "",
    slot: ""
  });

  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slotsLoaded, setSlotsLoaded] = useState(false);

  // Loading States
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {

    try {

      const response = await api.get("/api/doctors/available");

      setDoctors(response.data);

    } catch (error) {

      toast.error("Unable to load doctors");

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setAppointment((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "doctorName" || name === "appointmentDate"
        ? { slot: "" }
        : {})
    }));

    if (name === "doctorName" || name === "appointmentDate") {
      setSlots([]);
      setSlotsLoaded(false);
    }
  };

  const loadSlots = async () => {

    if (!appointment.doctorName || !appointment.appointmentDate) {
      toast.warning("Select Doctor and Date first");
      return;
    }

    setLoadingSlots(true);

    try {

      const response = await api.get(
        "/api/appointments/slots",
        {
          params: {
            doctorName: appointment.doctorName,
            date: appointment.appointmentDate
          }
        }
      );

      setSlots(response.data);
      setSlotsLoaded(true);

      console.log("Slots:", response.data);

      setLoadingSlots(false);

    } catch (error) {

      setLoadingSlots(false);

      toast.error("Unable to load slots");

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setBooking(true);

    try {

      const response = await api.post(
        "/api/appointments",
        appointment
      );

      console.log("SUCCESS", response);

      setBooking(false);

      toast.success("Appointment Booked Successfully!");

      setAppointment({
        doctorName: "",
        appointmentDate: "",
        slot: ""
      });

      setSlots([]);
      setSlotsLoaded(false);

      navigate("/appointments");

    } catch (error) {

      setBooking(false);

      if (error.response?.status === 409) {
        toast.error("Slot already booked");
      } else if (error.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }

    }

  };

  return (

    <div className="container mt-5">

      <div className="card shadow">

        <div className="card-body">

          <h2 className="mb-4">
            Book Appointment
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label>Doctor Name</label>

              <select
                className="form-select"
                name="doctorName"
                value={appointment.doctorName}
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.name}
                  >
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}

              </select>

            </div>

            <div className="mb-3">

              <label>Date</label>

              <input
  type="date"
  className="form-control"
  name="appointmentDate"
  value={appointment.appointmentDate}
  onChange={handleChange}
  min={new Date().toISOString().split("T")[0]}
  required
/>

            </div>

            <div className="mb-3">

              <label>Slot</label>

              <br />

              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={loadSlots}
                disabled={
                  !appointment.doctorName ||
                  !appointment.appointmentDate ||
                  loadingSlots
                }
              >
                {loadingSlots ? "Loading Slots..." : "Load Available Slots"}
              </button>

              {slotsLoaded && slots.length === 0 && (
                <p className="text-danger mt-2">
                  No slots available for this doctor on this date.
                </p>
              )}

              <p>Total Slots: {slots.length}</p>

              <div className="mt-2">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn m-1 ${
                      appointment.slot === slot
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() =>
                      setAppointment((prev) => ({
                        ...prev,
                        slot,
                      }))
                    }
                  >
                    {slot.substring(0, 5)}
                  </button>
                ))}
              </div>

              <p className="mt-3">
                Selected Slot:{" "}
                {appointment.slot
                  ? appointment.slot.substring(0, 5)
                  : ""}
              </p>

            </div>

            <button
              className="btn btn-primary"
              disabled={!appointment.slot || booking}
            >
              {booking ? "Booking..." : "Book Appointment"}
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default BookAppointment;