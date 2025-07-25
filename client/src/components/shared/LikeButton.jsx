import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

// --- New: Shockwave Particle Effect ---
const ShockwaveParticle = ({ isLiked }) => (
  <AnimatePresence>
    {isLiked && (
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute h-full w-full rounded-full border-2 border-red-400"
      />
    )}
  </AnimatePresence>
);

// --- New: Custom SVG Liquid Fill Heart ---
const LiquidFillHeart = ({ isLiked }) => {
  const heartPath =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  const liquidVariants = {
    unliked: { y: "100%" },
    liked: { y: "0%" },
  };

  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      initial={false}
      animate={isLiked ? "liked" : "unliked"}
    >
      <defs>
        <clipPath id="heart-clip">
          <path d={heartPath} />
        </clipPath>
      </defs>

      <motion.g clipPath="url(#heart-clip)">
        <motion.rect
          x="-10"
          y="0"
          width="44"
          height="24"
          className="fill-current text-red-500"
          variants={liquidVariants}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        />
      </motion.g>

      <motion.path
        d={heartPath}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current"
        variants={{
          unliked: { color: "rgb(107 114 128)" }, // text-gray-500
          liked: { color: "rgb(239 68 68)" }, // text-red-500
        }}
        style={{ fill: "transparent" }}
      />
    </motion.svg>
  );
};

const LikeButton = ({ post, onLikeToggle }) => {
  const { userInfo } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (post.likes) {
      setLikeCount(post.likes.length);
      setIsLiked(userInfo ? post.likes.includes(userInfo._id) : false);
    }
  }, [post.likes, userInfo]);

  const handleLike = async () => {
    if (!userInfo) {
      toast.error("You must be logged in to like a post.");
      return;
    }
    if (loading) return;

    setLoading(true);
    const originalLikedState = isLiked;
    const originalLikeCount = likeCount;

    controls.start({ scale: [1, 1.3, 1], transition: { duration: 0.4 } });

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      const { data } = await API.put(`/api/posts/${post._id}/like`);
      onLikeToggle(data);
    } catch (error) {
      toast.error("Failed to update like status.");
      setIsLiked(originalLikedState);
      setLikeCount(originalLikeCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={loading}
      className="relative flex h-10 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={controls}
    >
      <div className="absolute flex items-center justify-center">
        <ShockwaveParticle isLiked={isLiked && !loading} />
      </div>

      <div className="z-10 flex items-center gap-2">
        <LiquidFillHeart isLiked={isLiked} />
        <div className="relative w-4 text-left font-medium text-gray-600 dark:text-gray-300">
          <AnimatePresence initial={false}>
            <motion.span
              key={likeCount}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {likeCount}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
};

export default LikeButton;
