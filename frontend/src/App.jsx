import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"; // create this if not done

import ProtectedLogin from "./routes/ProtectedLogin";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <ProtectedLogin>
            <Login />
          </ProtectedLogin>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedLogin>
            <Signup />
          </ProtectedLogin>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
