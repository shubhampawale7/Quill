import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiTwitter, FiGithub, FiLinkedin, FiArrowUp } from "react-icons/fi";

// --- New: Interactive Social Icon with Spotlight ---
const SocialIcon = ({ href, icon }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothedMouseX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const smoothedMouseY = useSpring(mouseY, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(22);
        mouseY.set(22);
      }} // Center on leave
      whileHover={{ scale: 1.1, y: -4 }}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors dark:bg-black/5"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [smoothedMouseX, smoothedMouseY],
            ([x, y]) =>
              `radial-gradient(circle at ${x}px ${y}px, rgba(14, 165, 233, 0.3), transparent 80%)`
          ),
        }}
      />
      <span className="text-gray-500 group-hover:text-sky-500 dark:text-gray-400">
        {icon}
      </span>
    </motion.a>
  );
};

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden border-t border-gray-200/50 bg-white/30 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-950/30"
    >
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left Side: Brand & Copyright */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Quill
            </Link>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Quill. All rights reserved.
            </p>
          </div>

          {/* Center: Social Icons */}
          <div className="flex items-center gap-4">
            <SocialIcon href="#" icon={<FiTwitter size={20} />} />
            <SocialIcon href="#" icon={<FiGithub size={20} />} />
            <SocialIcon href="#" icon={<FiLinkedin size={20} />} />
          </div>

          {/* Right Side: Back to Top */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20"
            whileHover={{ scale: 1.05, y: -3, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowUp />
            Back to Top
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
