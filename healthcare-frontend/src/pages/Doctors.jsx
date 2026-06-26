import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function Doctors() {

    const [doctors, setDoctors] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [doctor, setDoctor] = useState({
        name: "",
        specialization: "",
        experience: "",
        available: true
    });

    const loadDoctors = async () => {

        try {

            const response = await api.get("/api/doctors");

            setDoctors(response.data);

        } catch (error) {

            toast.error("Unable to load doctors");

        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setDoctor(prev => ({
            ...prev,
            [name]:
                name === "available"
                    ? value === "true"
                    : value
        }));

    };


    const addDoctor = async (e) => {

        e.preventDefault();

        try {

            await api.post("/api/doctors", doctor);

            toast.success("Doctor Added Successfully");

            setDoctor({
                name: "",
                specialization: "",
                experience: "",
                available: true
            });

            loadDoctors();

        } catch (error) {

            toast.error(error.response?.data || "Unable to add doctor");

        }

    };

    const editDoctor = (doctor) => {

        setDoctor({
            name: doctor.name,
            specialization: doctor.specialization,
            experience: doctor.experience,
            available: doctor.available
        });

        setEditingId(doctor.id);

    };

    const updateDoctor = async (e) => {

        e.preventDefault();

        try {

            await api.put(`/api/doctors/${editingId}`, doctor);

            toast.success("Doctor Updated Successfully");

            setDoctor({
                name: "",
                specialization: "",
                experience: "",
                available: true
            });

            setEditingId(null);

            loadDoctors();

        } catch (error) {

            toast.error("Unable to update doctor");

        }

    };

    const deleteDoctor = async (id) => {

        if (!window.confirm("Delete this doctor?")) {
            return;
        }

        try {

            await api.delete(`/api/doctors/${id}`);

            toast.success("Doctor Deleted Successfully");

            loadDoctors();

        } catch (error) {

            toast.error("Unable to delete doctor");

        }

    };

    useEffect(() => {

        loadDoctors();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                Doctor Management
            </h2>

            <form
                onSubmit={editingId ? updateDoctor : addDoctor}
                className="card p-4 mb-4 shadow"
            >

                <h4>
                    {editingId ? "Update Doctor" : "Add Doctor"}
                </h4>

                <input
                    className="form-control mb-2"
                    placeholder="Doctor Name"
                    name="name"
                    value={doctor.name}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    placeholder="Specialization"
                    name="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Experience"
                    name="experience"
                    value={doctor.experience}
                    onChange={handleChange}
                    required
                />

                <select
                    className="form-select mb-3"
                    name="available"
                    value={doctor.available}
                    onChange={handleChange}
                >
                    <option value={true}>Available</option>
                    <option value={false}>Unavailable</option>
                </select>


                <div className="d-flex gap-2">

                    <button className="btn btn-primary">
                        {editingId ? "Update Doctor" : "Add Doctor"}
                    </button>

                    {editingId && (

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {

                                setEditingId(null);

                                setDoctor({
                                    name: "",
                                    specialization: "",
                                    experience: "",
                                    available: true
                                });

                            }}
                        >
                            Cancel
                        </button>

                    )}

                </div>
            </form>

            <table className="table table-bordered table-hover">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Experience</th>
                        <th>Available</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {doctors.map((doctor) => (

                        <tr key={doctor.id}>

                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.specialization}</td>
                            <td>{doctor.experience} Years</td>

                            <td>

                                <span
                                    className={`badge ${doctor.available
                                        ? "bg-success"
                                        : "bg-danger"
                                        }`}
                                >
                                    {doctor.available
                                        ? "Available"
                                        : "Unavailable"}
                                </span>

                            </td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => editDoctor(doctor)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteDoctor(doctor.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Doctors;