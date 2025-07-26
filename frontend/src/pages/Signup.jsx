import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        otp: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const sendOtp = async () => {
        const { name, username, email, password } = formData;
        if (!name || !username || !email || !password) {
            return setMessage("Please fill all fields before sending OTP.");
        }

        try {
            const res = await axios.post("http://localhost:8080/api/v1/auth/send-otp", {
                name,
                username,
                email,
                password,
            });
            setOtpSent(true);
            setMessage(res.message || "OTP sent successfully.");
        } catch (err) {
            setMessage(err.message || "Error sending OTP.");
        }
    };

    const registerUser = async () => {
        const { email, otp } = formData;
        if (!otp) return setMessage("Please enter the OTP.");

        try {
            const res = await axios.post("http://localhost:8080/api/v1/auth/verify-otp", {
                email,
                otp,
            });
            setMessage(res.data.message || "User registered successfully.");

            setToastMessage("User registered successfully. Redirecting to login...");
            setToastType("success");

            setTimeout(() => {
                setToastMessage("");
                // Redirect to login page (adjust your route accordingly)
                window.location.href = "/login";
            }, 2500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed.");
            setToastMessage(err.response?.data?.message || "Registration failed.");
            setToastType("error");
            setTimeout(() => setToastMessage(""), 3000);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Nav />
            <main className="flex-1 flex justify-center items-center bg-gray-900">
                <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up</h2>

                    {message && (
                        <div className="mb-4 text-sm text-red-500 text-center">{message}</div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded"
                        />

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded"
                        />

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded pr-10"
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        {/* OTP Field */}
                        {otpSent && (
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                            />
                        )}

                        {/* Buttons */}
                        <div className="flex justify-between gap-2 mt-4">
                            {!otpSent ? (
                                <button
                                    onClick={sendOtp}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                >
                                    Send OTP
                                </button>
                            ) : (
                                <button
                                    onClick={registerUser}
                                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                                >
                                    Register
                                </button>
                            )}
                        </div>
                    </div>
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setToastMessage("")}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup;