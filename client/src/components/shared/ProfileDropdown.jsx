import { Menu } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiSettings,
  FiBookmark,
} from "react-icons/fi";
import { toast } from "sonner";

// --- Reusable, "Magic Motion" Menu Item ---
const MenuItemLink = ({ to, icon, children }) => (
  <Menu.Item as="div" className="relative p-1">
    {({ active, close }) => (
      <Link
        to={to}
        onClick={close}
        className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
      >
        {active && (
          <motion.div
            layoutId="profile-menu-highlight"
            className="absolute inset-1 rounded-md bg-sky-200 dark:bg-sky-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        <motion.span
          className="relative z-10 mr-3 h-5 w-5"
          animate={{
            scale: active ? 1.2 : 1,
            color: active ? "#0ea5e9" : "#6b7280",
          }}
        >
          {icon}
        </motion.span>
        <span className="relative z-10">{children}</span>
      </Link>
    )}
  </Menu.Item>
);

const ProfileDropdown = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!userInfo) {
    return null;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 rounded-full bg-pink/50 py-1.5 pl-2 pr-4 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-black/5 focus:outline-none dark:bg-black/50 dark:text-gray-200 dark:ring-white/10"
          >
            <img
              src={
                userInfo.avatarUrl ||
                `https://i.pravatar.cc/150?u=${userInfo._id}`
              }
              alt={userInfo.name}
              className="h-8 w-8 rounded-full"
            />
            {userInfo.name}
            <motion.div animate={{ rotate: open ? 180 : 0 }}>
              <FiChevronDown className="h-5 w-5 text-gray-500" />
            </motion.div>
          </Menu.Button>

          <AnimatePresence>
            {open && (
              <Menu.Items
                as={motion.div}
                static
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/10 bg-white/90 p-1 shadow-2xl shadow-black/10 backdrop-blur-xl focus:outline-none dark:bg-black/50"
              >
                <div className="border-b border-gray-900/5 px-4 py-3 dark:border-white/5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userInfo.name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {userInfo.email}
                  </p>
                </div>

                <div className="py-1">
                  <MenuItemLink
                    to={`/profile/${userInfo._id}`}
                    icon={<FiUser />}
                  >
                    My Profile
                  </MenuItemLink>
                  <MenuItemLink to="/bookmarks" icon={<FiBookmark />}>
                    My Bookmarks
                  </MenuItemLink>
                  <MenuItemLink to="/settings" icon={<FiSettings />}>
                    Account Settings
                  </MenuItemLink>
                </div>

                <Menu.Item as="div" className="relative p-1">
                  {({ active, close }) => (
                    <button
                      onClick={() => {
                        handleLogout();
                        close();
                      }}
                      className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {active && (
                        <motion.div
                          layoutId="profile-menu-highlight"
                          className="absolute inset-1 rounded-md bg-red-500/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      <motion.span
                        className="relative z-10 mr-3 h-5 w-5"
                        animate={{
                          scale: active ? 1.2 : 1,
                          color: active ? "#ef4444" : "#6b7280",
                        }}
                      >
                        <FiLogOut />
                      </motion.span>
                      <span className="relative z-10">Logout</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  );
};

export default ProfileDropdown;
