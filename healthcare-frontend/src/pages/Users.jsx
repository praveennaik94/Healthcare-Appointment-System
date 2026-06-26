import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function Users() {

    const [users, setUsers] = useState([]);

    const loadUsers = async () => {

        try {

            const response = await api.get("/api/admin/users");

            setUsers(response.data);

        } catch (error) {

            toast.error("Unable to load users");

        }

    };

    useEffect(() => {

        loadUsers();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                User Management
            </h2>

            <table className="table table-bordered table-hover">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map(user => (

                        <tr key={user.id}>

                            <td>{user.id}</td>

                            <td>{user.name}</td>

                            <td>{user.email}</td>

                            <td>

                                <span
                                    className={`badge ${
                                        user.role === "ADMIN"
                                            ? "bg-danger"
                                            : "bg-success"
                                    }`}
                                >
                                    {user.role}
                                </span>

                            </td>

                            <td>
                                {user.createdAt.replace("T", " ")}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Users;