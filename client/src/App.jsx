import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

// Import all the redesigned layout and UI components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ReadingProgressBar from "./components/ui/ReadingProgressBar";
import WelcomeMessage from "./components/shared/WelcomeMessage";
import Loader from "./components/ui/Loader";

// --- Animated Aurora Background Component ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-gray-950">
    <motion.div
      className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl"
      animate={{
        x: [0, 100, 0, -50, 0],
        y: [0, -50, 100, 50, 0],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-3xl"
      animate={{
        x: [0, -100, 0, 50, 0],
        y: [0, 50, -100, -50, 0],
      }}
      transition={{
        duration: 40,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  </div>
);

function App() {
  const location = useLocation();

  // --- More sophisticated page transition variants ---
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    in: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
    out: {
      opacity: 0,
      y: -20,
      filter: "blur(4px)",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="relative text-gray-900 dark:text-gray-100">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Toaster position="top-center" richColors />
        <ReadingProgressBar />
        <WelcomeMessage />
        <Navbar />

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
            >
              <Suspense fallback={<Loader message="Loading page..." />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
