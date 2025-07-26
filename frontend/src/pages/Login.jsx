import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Toast from "../components/Toast";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToast = (message, type = "success") => {
        setToast({ message, type });

        // Clear toast after 3 seconds
        setTimeout(() => {
            setToast({ message: "", type: "success" });
        }, 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return handleToast("Please fill all fields", "error");
        }

        try {
            const res = await axios.post(
                `http://localhost:8080/api/v1/user/login`,
                formData,
                { withCredentials: true } // ensures cookie is sent
            );

            handleToast("Login successful", "success");

            // Slight delay so user can read the toast
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || "Login failed";
            handleToast(msg, "error");
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Nav />

            <div className="flex-1 flex items-center justify-center bg-gray-900 p-4">
                {toast.message && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ message: "" })}
                    />
                )}

                <form
                    onSubmit={handleLogin}
                    className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
                >
                    <h2 className="text-2xl font-semibold text-center">Login</h2>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-2 border rounded-md"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border rounded-md pr-10"
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
