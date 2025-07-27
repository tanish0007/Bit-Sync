// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Checking session...</div>;

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
