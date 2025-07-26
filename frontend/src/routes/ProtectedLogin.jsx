
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedLogin = ({ children }) => {
  const token = Cookies.get("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default ProtectedLogin;
