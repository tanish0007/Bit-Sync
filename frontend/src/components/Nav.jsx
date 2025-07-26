import { Link } from "react-router-dom";

const 
Nav = () => {
    return (
        <nav className="w-full bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide text-cyan-400">
                    BitSync
                </Link>

                {/* Navigation Links */}
                <div className="space-x-6 hidden md:flex">
                    <Link to="/gallery" className="hover:text-cyan-400 transition duration-200">
                        Gallery
                    </Link>
                    <Link to="/about" className="hover:text-cyan-400 transition duration-200">
                        About
                    </Link>
                    <Link to="/contact" className="hover:text-cyan-400 transition duration-200">
                        Contact
                    </Link>
                </div>

                {/* Auth Buttons (optional) */}
                <div className="space-x-3 hidden md:flex">
                    <Link to="/login" className="px-4 py-1 rounded text-gray-900 bg-cyan-500">
                        Login
                    </Link>
                    <Link to="/signup" className="px-4 py-1 rounded border border-cyan-500 hover:bg-cyan-500 transition">
                        Sign Up 
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;