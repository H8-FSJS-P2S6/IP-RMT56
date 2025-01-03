import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="./image/uniqlo-logo-BDEC351EFB-seeklogo.com.png" // Replace with your logo URL
          alt="Logo"
          className="h-8"
        />
        <span className="text-xl font-bold">My Site</span>
      </Link>

      {/* Navbar Links */}
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-400">
          Home
        </Link>
        <Link to="/about" className="hover:text-gray-400">
          About
        </Link>
        <Link to="/contact" className="hover:text-gray-400">
          Contact
        </Link>

        {/* Login Button */}
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
