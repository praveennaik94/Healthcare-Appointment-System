import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import BookAppointment from "./pages/BookAppointment";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Users from "./pages/Users";
import AllAppointments from "./pages/AllAppointments";

function PrivateRoute({ children }) {

    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/" />;

}

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                {/* USER + ADMIN */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/book"
                    element={
                        <PrivateRoute>
                            <BookAppointment />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/appointments"
                    element={
                        <PrivateRoute>
                            <MyAppointments />
                        </PrivateRoute>
                    }
                />

                {/* ADMIN ONLY */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/appointments"
                    element={
                        <AdminRoute>
                            <AllAppointments />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <AdminRoute>
                            <Users />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/doctors"
                    element={
                        <AdminRoute>
                            <Doctors />
                        </AdminRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;