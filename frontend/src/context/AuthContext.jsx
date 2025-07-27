import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // track loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/user/dashboard", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setUser(res.data.user); // ✅ use res.data.user instead of res.user
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
