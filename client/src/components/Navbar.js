import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-3">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-200"
        >
          <img
            src="nhq-logo.png" // <-- replace with your actual logo path
            alt="NHQ Logo"
            className=" h-3/4 w-3/4 object-contain rounded-xl bg-slate-100 p-1 shadow-md "
          />
        </Link>

        {/* Right side: user info / auth buttons */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          {token ? (
            <>
              <span className="text-sm opacity-90">
                Hi, {user?.name || user?.username || user?.email || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300 text-sm transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-300 text-sm transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
