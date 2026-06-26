import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import BookAppointment from "./pages/BookAppointment";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Register from "./pages/Register";

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

        <Route path="/doctors" element={<Doctors />} />

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

        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <MyAppointments />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;