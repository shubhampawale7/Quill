import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { FiLoader, FiSend } from "react-icons/fi";

// --- New: Animated Character Counter ---
const CharacterCounter = ({ count, limit }) => {
  const progress = useSpring(count / limit, { stiffness: 200, damping: 30 });
  const color = count > limit ? "#ef4444" : "#0ea5e9";

  return (
    <div className="relative h-8 w-8">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-current text-gray-200 dark:text-gray-700"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-current"
          strokeWidth="8"
          fill="none"
          strokeDasharray="282.6"
          style={{
            strokeDashoffset: useSpring(progress.get() * 282.6, {
              stiffness: 200,
              damping: 30,
            }),
            stroke: color,
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {count}
      </span>
    </div>
  );
};

const CommentForm = ({ postId, onCommentPosted }) => {
  const [text, setText] = useState("");
  const { userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CHARS = 280;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || text.length > MAX_CHARS) {
      toast.error(
        text.length > MAX_CHARS
          ? "Comment is too long."
          : "Comment cannot be empty."
      );
      return;
    }
    setLoading(true);
    try {
      await API.post(`/api/comments/${postId}`, { text });
      setText("");
      setIsExpanded(false);
      toast.success("Comment posted!");
      onCommentPosted();
    } catch (error) {
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  // --- "Not Logged In" State ---
  if (!userInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-2xl border border-white/10 bg-white/30 p-6 text-center shadow-lg backdrop-blur-md dark:bg-black/30"
      >
        <p className="mb-4 font-medium text-gray-700 dark:text-gray-300">
          Join the conversation!
        </p>
        <Link to="/login">
          <motion.button
            className="rounded-lg bg-sky-500 px-6 py-2 font-semibold text-white shadow-md shadow-sky-500/20"
            whileHover={{
              scale: 1.05,
              y: -2,
              boxShadow: "0px 10px 20px -5px rgba(56, 189, 248, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Login to Comment
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  // --- Logged In State ---
  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        layout="position"
        className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/30 p-4 shadow-lg backdrop-blur-md dark:bg-black/30"
      >
        <img
          src={
            userInfo.avatarUrl || `https://i.pravatar.cc/150?u=${userInfo._id}`
          }
          alt={userInfo.name}
          className="h-10 w-10 flex-shrink-0 rounded-full"
        />
        <div className="flex-1">
          <textarea
            onClick={() => setIsExpanded(true)}
            onFocus={() => setIsExpanded(true)}
            className={`w-full resize-none border-none bg-transparent text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none dark:text-gray-200 dark:placeholder-gray-400 ${
              isExpanded ? "h-24 text-base" : "h-6 text-sm"
            }`}
            placeholder={isExpanded ? "" : "Write a thoughtful comment..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 flex items-center justify-between"
              >
                <CharacterCounter count={text.length} limit={MAX_CHARS} />
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <AnimatePresence>
                    {text.trim() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="flex w-32 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loading ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <>
                            Post <FiSend />
                          </>
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.form>
  );
};

export default CommentForm;
