import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import ProfileDropdown from "../shared/ProfileDropdown";
import SearchModal from "../shared/SearchModal"; // Import the new modal
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

// --- Advanced Desktop NavLink with Animated Indicator ---
const DesktopNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className="group relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-sky-500 dark:text-gray-300 dark:hover:text-sky-400"
  >
    {({ isActive }) => (
      <>
        <span className="relative z-10">{children}</span>
        {isActive && (
          <motion.div
            layoutId="desktop-active-link"
            className="absolute inset-0 rounded-md bg-gray-100 dark:bg-gray-800"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </>
    )}
  </NavLink>
);

const Navbar = () => {
  const { userInfo } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Search logic for the mobile menu's search bar
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
      setMobileMenuOpen(false); // Close menu on search
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    ...(userInfo ? [{ name: "Dashboard", href: "/admin" }] : []),
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
        className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-950/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Quill
              </Link>
              <div className="hidden items-center md:flex">
                {navLinks.map((link) => (
                  <DesktopNavLink key={link.name} to={link.href}>
                    {link.name}
                  </DesktopNavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <motion.button
                onClick={() => setSearchModalOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiSearch size={22} />
              </motion.button>

              <div className="hidden md:flex items-center gap-4">
                {userInfo ? (
                  <ProfileDropdown />
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-sky-500 dark:text-gray-300 dark:hover:text-sky-400"
                  >
                    Login
                  </Link>
                )}
              </div>
              <ThemeSwitcher />

              <div className="flex md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-500"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mobileMenuOpen ? "close" : "open"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mobileMenuOpen ? (
                        <FiX size={24} />
                      ) : (
                        <FiMenu size={24} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {searchModalOpen && (
          <SearchModal closeModal={() => setSearchModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-white p-4 dark:bg-gray-950 md:hidden"
          >
            <div className="flex h-16 items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold"
              >
                Quill
              </Link>
            </div>

            <form onSubmit={handleMobileSearchSubmit} className="relative mt-4">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search posts..."
                className="h-12 w-full rounded-lg border-2 border-gray-200 bg-gray-100 pl-12 pr-4 text-lg focus:border-sky-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900"
              />
              <button
                type="submit"
                className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center text-gray-500"
              >
                <FiSearch size={22} />
              </button>
            </form>

            <motion.ul
              className="mt-8 space-y-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
              }}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: 20, opacity: 0 },
                  }}
                >
                  <NavLink
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-lg font-medium ${
                        isActive
                          ? "bg-sky-100 text-sky-600 dark:bg-sky-500/10"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 20, opacity: 0 },
                }}
                className="border-t border-gray-200 pt-4 dark:border-gray-800"
              >
                {userInfo ? (
                  <ProfileDropdown />
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300"
                  >
                    Login
                  </NavLink>
                )}
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
