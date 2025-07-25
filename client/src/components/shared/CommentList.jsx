import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  FiMessageSquare,
  FiCornerDownRight,
  FiChevronsDown,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import API from "../../api";

// --- In-line Reply Form ---
const ReplyForm = ({ onCancel, onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const { userInfo } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3 pt-4">
      <img
        src={userInfo?.avatarUrl}
        alt="Your avatar"
        className="h-8 w-8 rounded-full"
      />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full rounded-lg border-gray-300 bg-gray-100 p-2 text-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
          rows="2"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-sky-500 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

// --- Recursive Comment Item ---
const CommentItem = ({ comment, onCommentPosted, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    // Automatically collapse deep threads
    if (level >= 1) setIsExpanded(false);
  }, [level]);

  const handleReplySubmit = async (text) => {
    setIsSubmittingReply(true);
    await onCommentPosted(text, comment._id);
    setIsReplying(false);
    setIsSubmittingReply(false);
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative ${level > 0 ? "pl-8" : ""}`}
    >
      {level > 0 && (
        <div className="absolute left-0 top-0 h-full w-8">
          <svg
            width="100%"
            height="100%"
            className="stroke-current text-gray-200 dark:text-gray-800"
          >
            <line x1="16" y1="0" x2="16" y2="20" strokeWidth="2" />
            <line x1="16" y1="20" x2="32" y2="20" strokeWidth="2" />
          </svg>
        </div>
      )}

      <div className="relative flex items-start gap-4">
        <img
          src={
            comment.user?.avatarUrl ||
            `https://i.pravatar.cc/150?u=${comment.user?._id}`
          }
          alt={comment.user?.name}
          className="h-10 w-10 flex-shrink-0 rounded-full"
        />
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`flex-1 rounded-2xl border p-4 shadow-lg ${
            isReplying ? "border-sky-500/50" : "border-white/10"
          } bg-white/30 backdrop-blur-md dark:bg-black/30`}
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 dark:text-white">
              {comment.user?.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="prose prose-sm mt-2 max-w-none text-gray-700 dark:text-gray-300">
            {comment.text}
          </p>
          {userInfo && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-600"
            >
              <FiCornerDownRight size={14} /> Reply
            </button>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pl-14 pt-2"
          >
            <ReplyForm
              onCancel={() => setIsReplying(false)}
              onSubmit={handleReplySubmit}
              isLoading={isSubmittingReply}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {comment.replies && comment.replies.length > 0 && (
        <div className="pt-4 pl-8 space-y-4">
          {isExpanded ? (
            <AnimatePresence>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onCommentPosted={onCommentPosted}
                  level={level + 1}
                />
              ))}
            </AnimatePresence>
          ) : (
            <motion.button
              layout
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-sky-500 dark:text-gray-400"
              whileHover={{ x: 2 }}
            >
              <FiChevronsDown /> Show {comment.replies.length}{" "}
              {comment.replies.length > 1 ? "replies" : "reply"}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

const CommentList = ({ postId, comments, setComments }) => {
  const handleCommentPosted = async (text, parentId = null) => {
    try {
      await API.post(`/api/comments/${postId}`, { text, parent: parentId });
      const { data: updatedComments } = await API.get(
        `/api/comments/${postId}`
      );
      setComments(updatedComments);
      toast.success(parentId ? "Reply posted!" : "Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50"
      >
        <FiMessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="font-medium text-gray-600 dark:text-gray-400">
          No comments yet.
          <br />
          <span className="font-normal">
            Be the first to share your thoughts!
          </span>
        </p>
      </motion.div>
    );
  }

  const topLevelComments = comments.filter((comment) => !comment.parent);

  return (
    <div className="mt-8 space-y-6">
      <AnimatePresence>
        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onCommentPosted={handleCommentPosted}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CommentList;
