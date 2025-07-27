import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"; 
import Logout from "./pages/Logout";
import ProtectedLogin from "./routes/ProtectedLogin";
import ProtectedRoute from "./routes/ProtectedRoute";
import MeetingRoom from "./pages/MeetingRoom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
                                      <ProtectedLogin>
                                        <Login />
                                      </ProtectedLogin>
                                  }/>
      <Route path="/signup" element={
                                      <ProtectedLogin>
                                        <Signup />
                                      </ProtectedLogin>
                                    }/>
      <Route path="/dashboard" element={  
                                          <ProtectedRoute> 
                                            <Dashboard />
                                          </ProtectedRoute>
                                      }/>
      <Route path="/room/:roomId" element={<MeetingRoom />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default App;
