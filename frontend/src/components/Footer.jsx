const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                {/* Left: Brand */}
                <div className="text-sm text-center md:text-left">
                    © {new Date().getFullYear()} <span className="text-cyan-400 font-semibold">Bit-Sync</span>. All rights reserved.
                </div>

                {/* Right: Links */}
                <div className="flex space-x-4 mt-3 md:mt-0">
                    <a href="/privacy" className="hover:text-white text-sm transition">Privacy</a>
                    <a href="/terms" className="hover:text-white text-sm transition">Terms</a>
                    <a href="/contact" className="hover:text-white text-sm transition">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
