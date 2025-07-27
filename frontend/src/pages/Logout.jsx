// src/pages/Logout.jsx
import { useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const { setUser } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.post(
          "http://localhost:8080/api/v1/user/logout",
          {},
          { withCredentials: true }
        );
        setUser(null); // Clear user context
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

    doLogout();
  }, []);

  return <Navigate to="/login" replace />;
};

export default Logout;
