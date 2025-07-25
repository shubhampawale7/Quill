import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";

const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.01 && latest < 0.99);
  });

  return (
    // The z-index has been increased to ensure it's above the navbar
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[99] h-2">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
        // A subtle glow is added for better visual separation
        style={{
          scaleX,
          transformOrigin: "0%",
          boxShadow: "0 2px 10px rgba(14, 165, 233, 0.5)",
        }}
      >
        {/* The "Comet" or "Sparkle" at the end of the bar */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="absolute right-0 top-0 h-full w-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
                boxShadow: "0 0 10px #fff, 0 0 8px #0ea5e9, 0 0 5px #38bdf8",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReadingProgressBar;
