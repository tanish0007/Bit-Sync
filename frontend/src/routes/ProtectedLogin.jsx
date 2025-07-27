// src/routes/ProtectedLogin.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedLogin = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-20">Checking session...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default ProtectedLogin;
