// components/Toast.jsx
import { useEffect } from "react";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  // Auto-close after duration
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        maxWidth: "300px",
        padding: "1rem 1.5rem",
        backgroundColor: type === "success" ? "#4CAF50" : "#f44336",
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default Toast;
