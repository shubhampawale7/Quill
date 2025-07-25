import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiSunrise } from "react-icons/fi";

// --- New: Redesigned Custom Toast Component ---
const WelcomeToast = ({ name, avatarUrl, message, Icon }) => {
  // Variants for the letter-by-letter animation
  const sentenceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/30 p-4 shadow-2xl backdrop-blur-lg dark:bg-black/30"
    >
      <img
        src={avatarUrl || `https://i.pravatar.cc/150?u=${name}`}
        alt={name}
        className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-sky-300"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <div className="relative flex h-5 w-5 items-center justify-center">
            {/* Glowing spotlight effect */}
            <div className="absolute h-8 w-8 rounded-full bg-yellow-500/30 blur-lg" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="h-5 w-5 text-yellow-500" />
            </motion.div>
          </div>
          {/* Letter-by-letter animation */}
          <motion.p
            className="text-base font-bold text-gray-800 dark:text-white"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
          >
            {message.split("").map((char, index) => (
              <motion.span key={`${char}-${index}`} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          It's great to see you!
        </p>
      </div>
    </motion.div>
  );
};

const WelcomeMessage = () => {
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    if (!userInfo) return;

    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return { msg: "Good morning", Icon: FiSunrise };
      if (currentHour < 18) return { msg: "Good afternoon", Icon: FiSun };
      return { msg: "Good evening", Icon: FiMoon };
    };

    const now = new Date().getTime();
    const lastVisit = localStorage.getItem("lastVisit");
    const { msg, Icon } = getGreeting();

    // Custom toast options to remove default styling
    const toastOptions = {
      duration: 5000,
      unstyled: true, // This is key to remove sonner's default styles
      classNames: {
        toast: "w-full",
        title: "text-red-400",
        description: "text-red-400",
      },
    };

    const showToast = (message) => {
      toast.custom(
        (t) => (
          <WelcomeToast
            name={userInfo.name}
            avatarUrl={userInfo.avatarUrl}
            message={message}
            Icon={Icon}
          />
        ),
        toastOptions
      );
    };

    if (!lastVisit) {
      showToast(`Welcome to Quill, ${userInfo.name}!`);
    } else if (now - parseInt(lastVisit) > 3600000) {
      // 1 hour
      showToast(`${msg}, ${userInfo.name}!`);
    }

    localStorage.setItem("lastVisit", now.toString());
  }, [userInfo]);

  return null;
};

export default WelcomeMessage;
