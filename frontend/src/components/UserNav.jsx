import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserNav = () => {
    const { user } = useAuth();

    return (
        <nav className="w-full bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <span className="text-2xl font-bold tracking-wide text-cyan-400">
                    Hi, {user?.username || "User"}
                </span>

                <div className="space-x-3 hidden md:flex">
                    <Link to="/logout" className="px-4 py-1 rounded text-gray-900 bg-cyan-500">
                        Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default UserNav;
