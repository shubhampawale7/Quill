import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import ReadingProgressBar from "./components/ui/ReadingProgressBar";
import WelcomeMessage from "./components/shared/WelcomeMessage";

function App() {
  const location = useLocation();

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      <ReadingProgressBar />
      <Toaster position="top-center" richColors />
      <WelcomeMessage />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
