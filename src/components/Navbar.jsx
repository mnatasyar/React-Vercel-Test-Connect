import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="text-blue-500 hover:text-blue-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Profile
                </Link>
                <Link
                  to="/recommend"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Course Recommendations
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
