import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";

// --- New: Stardust Particle Effect ---
const StardustParticle = () => {
  const duration = Math.random() * 1 + 0.5;
  const delay = Math.random() * 0.2;
  const endX = (Math.random() - 0.5) * 100;
  const endY = (Math.random() - 0.5) * 100;

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 1, scale: Math.random() * 0.8 + 0.5, x: 0, y: 0 }}
      animate={{ opacity: 0, scale: 0, x: endX, y: endY }}
      transition={{ duration, ease: "easeOut", delay }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10">
        <circle
          cx="5"
          cy="5"
          r="5"
          fill={Math.random() > 0.5 ? "#0ea5e9" : "#67e8f9"}
        />
      </svg>
    </motion.div>
  );
};

// --- New: Galactic Shockwave Effect ---
const Shockwave = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0.7 }}
    animate={{ scale: 1.5, opacity: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="absolute inset-0 rounded-full"
    style={{
      background:
        "radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, rgba(14, 165, 233, 0) 70%)",
    }}
  />
);

// --- New: Morphing Bookmark/Star Icon ---
const MorphingIcon = ({ isBookmarked }) => {
  const bookmarkPath = "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z";
  const starPath =
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

  return (
    <div className="relative h-6 w-6">
      <AnimatePresence>
        <motion.svg
          key={isBookmarked ? "star" : "bookmark"}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`absolute fill-current ${
            isBookmarked
              ? "text-yellow-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <path d={isBookmarked ? starPath : bookmarkPath} />
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};

const BookmarkButton = ({ postId }) => {
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo?.bookmarks) {
      setIsBookmarked(userInfo.bookmarks.includes(postId));
    }
  }, [userInfo, postId]);

  const handleBookmark = async () => {
    if (!userInfo) return toast.error("Please log in to save posts.");
    if (loading) return;

    setLoading(true);
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!wasBookmarked);

    try {
      const { data } = await API.put(`/api/users/profile/bookmarks/${postId}`);
      updateUserInfo({ ...userInfo, bookmarks: data });
      if (!wasBookmarked) {
        toast.success("Post saved to your collection!");
      }
    } catch (error) {
      setIsBookmarked(wasBookmarked);
      toast.error("Failed to update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleBookmark}
      disabled={loading}
      title="Save for later"
      className="relative flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence>
        {isBookmarked && !loading && <Shockwave />}
      </AnimatePresence>

      <div className="absolute">
        {isBookmarked &&
          !loading &&
          [...Array(15)].map((_, i) => <StardustParticle key={i} />)}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader">
            <FiLoader className="h-6 w-6 animate-spin text-gray-400" />
          </motion.div>
        ) : (
          <motion.div key="icon">
            <MorphingIcon isBookmarked={isBookmarked} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default BookmarkButton;
