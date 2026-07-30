import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";


const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate 
      to={user.role === "admin" ? "/admin" : "/provider"} 
      replace 
    />
  );
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/provider"
        element={
          <ProtectedRoute role="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};


export default AppRoutes;