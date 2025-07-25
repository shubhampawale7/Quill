import Lottie from "lottie-react";
import { motion } from "framer-motion";
import animationData from "../../assets/lottie/loader.json";

const Loader = ({ message = "Loading..." }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-40 h-40">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <motion.p
        className="text-lg font-semibold text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default Loader;
