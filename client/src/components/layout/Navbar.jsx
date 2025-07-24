import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import SearchBox from "../shared/SearchBox";
import ProfileDropdown from "../shared/ProfileDropdown"; // Import the new component

const Navbar = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <nav className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Quill
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            {userInfo && (
              <Link
                to="/admin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right-side Actions */}
          <div className="flex items-center gap-4">
            <SearchBox />

            {userInfo ? (
              <ProfileDropdown /> // Use the new dropdown component
            ) : (
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
            )}

            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
