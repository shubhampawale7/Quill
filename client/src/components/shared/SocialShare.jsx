import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiMessageCircle,
} from "react-icons/fi";

// --- Configuration for each platform ---
const sharePlatforms = [
  {
    Button: TwitterShareButton,
    Icon: FiTwitter,
    name: "Twitter",
    color: "#1DA1F2",
  },
  {
    Button: FacebookShareButton,
    Icon: FiFacebook,
    name: "Facebook",
    color: "#1877F2",
  },
  {
    Button: LinkedinShareButton,
    Icon: FiLinkedin,
    name: "LinkedIn",
    color: "#0A66C2",
  },
  {
    Button: WhatsappShareButton,
    Icon: FiMessageCircle,
    name: "WhatsApp",
    color: "#25D366",
  },
];

// --- Reusable Dock Icon Component ---
const DockIcon = ({ mouseX, platform, postUrl, title }) => {
  const ref = useRef(null);

  // Calculate distance from mouse to the center of the icon
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Animate scale and y-offset based on distance
  const scale = useTransform(distance, [-150, 0, 150], [1, 2.5, 1]);
  const y = useTransform(distance, [-150, 0, 150], [0, -30, 0]);

  // Use a spring for a more natural animation
  const scaleSpring = useSpring(scale, { stiffness: 400, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 400, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ scale: scaleSpring, y: ySpring }}
      className="flex items-center justify-center"
    >
      <platform.Button
        url={postUrl}
        title={title}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition-colors duration-300 dark:bg-gray-800 dark:text-gray-200"
        style={{ "--hover-bg": platform.color }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = platform.color)
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
      >
        <platform.Icon className="h-6 w-6 transition-colors duration-300 group-hover:text-white" />
      </platform.Button>
    </motion.div>
  );
};

const SocialShare = ({ postUrl, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center gap-4 py-2"
    >
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Share:
      </span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2"
          >
            <div className="flex items-end gap-4 rounded-2xl border border-white/10 bg-white/30 p-4 shadow-lg backdrop-blur-md dark:bg-black/30">
              {sharePlatforms.map((platform) => (
                <DockIcon
                  key={platform.name}
                  mouseX={mouseX}
                  platform={platform}
                  postUrl={postUrl}
                  title={title}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
