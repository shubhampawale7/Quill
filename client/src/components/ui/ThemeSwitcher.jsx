import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- New: Twinkling Star Component for Dark Mode ---
const Star = ({ delay }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
      delay,
    }}
    style={{
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
  />
);

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const orbVariants = {
    light: {
      backgroundColor: "rgba(252, 211, 77, 1)", // yellow-300
      boxShadow: "0px 0px 20px 5px rgba(252, 211, 77, 0.5)",
    },
    dark: {
      backgroundColor: "rgba(30, 58, 138, 1)", // blue-900
      boxShadow: "0px 0px 20px 5px rgba(30, 58, 138, 0.5)",
    },
  };

  const iconVariants = {
    hidden: { y: 30, opacity: 0, rotate: -90 },
    visible: { y: 0, opacity: 1, rotate: 0 },
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
      variants={orbVariants}
      animate={isLight ? "light" : "dark"}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      aria-label="Toggle theme"
    >
      {/* --- Starry Background for Dark Mode --- */}
      <AnimatePresence>
        {!isLight && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {[...Array(10)].map((_, i) => (
              <Star key={i} delay={i * 0.15} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Sun Rays for Light Mode --- */}
      <AnimatePresence>
        {isLight && (
          <motion.div
            key="sun-rays"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            transition={{ duration: 0.3 }}
            className="absolute text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <FiSun size={32} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Sun/Moon Icon --- */}
      <div className="relative h-6 w-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute inset-0 text-white"
          >
            {isLight ? <FiSun size={24} /> : <FiMoon size={24} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default ThemeSwitcher;
