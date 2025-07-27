// src/routes/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = checked
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/user/dashboard", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center mt-20">Checking authentication...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;