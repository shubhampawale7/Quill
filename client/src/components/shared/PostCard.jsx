import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiArrowRight } from "react-icons/fi";

// Import the action button components
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";

const PostCard = ({ post, isFeatured = false }) => {
  // --- Animation Variants for "Magnetic Reveal" ---
  const cardVariants = {
    rest: { boxShadow: "0px 10px 30px -15px rgba(0,0,0,0.1)" },
    hover: {
      scale: 1.03,
      boxShadow: "0px 20px 40px -15px rgba(14, 165, 233, 0.3)",
      transition: { staggerChildren: 0.1 },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const underlineVariants = {
    rest: { scaleX: 0, transition: { duration: 0.3, ease: "easeOut" } },
    hover: {
      scaleX: 1,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
    },
  };

  const authorInfoVariants = {
    rest: { x: 0 },
    hover: { x: 12 },
  };

  const readMoreVariants = {
    rest: { x: -20, opacity: 0 },
    hover: { x: 0, opacity: 1 },
  };

  // --- New variants for the action buttons ---
  const actionButtonVariants = {
    rest: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
    hover: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full w-full"
    >
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 ${
          isFeatured ? "min-h-[450px]" : "min-h-[350px]"
        }`}
      >
        {/* --- Image & Action Buttons --- */}
        <div className="relative h-48 w-full overflow-hidden">
          <Link to={`/post/slug/${post.slug}`} className="absolute inset-0">
            <motion.img
              variants={imageVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={post.imageUrl || "https://via.placeholder.com/600x400"}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </Link>

          {/* --- New: Animated Action Buttons Container --- */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <motion.div
              variants={actionButtonVariants}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* NOTE: We pass a dummy onLikeToggle because we don't need to update homepage state */}
              <LikeButton post={post} onLikeToggle={() => {}} />
            </motion.div>
            <motion.div
              variants={actionButtonVariants}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.05,
              }}
            >
              <BookmarkButton postId={post._id} />
            </motion.div>
          </div>
        </div>

        {/* --- Text Content (wrapped in a Link) --- */}
        <div className="flex flex-grow flex-col p-6">
          <Link
            to={`/post/slug/${post.slug}`}
            className="flex flex-grow flex-col"
          >
            {post.category && (
              <span className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-500">
                {post.category.name}
              </span>
            )}
            <h3
              className={`font-extrabold leading-tight text-gray-900 dark:text-white ${
                isFeatured ? "text-3xl" : "text-xl"
              }`}
            >
              {post.title}
            </h3>
            <motion.div
              variants={underlineVariants}
              className="mt-1 h-0.5 origin-left bg-gradient-to-r from-cyan-400 to-sky-500"
            />
            <div className="flex-grow" />
            {/* Spacer to push footer to the bottom */}
          </Link>

          {/* --- Footer with Magnetic Effect --- */}
          <div className="mt-auto flex items-end justify-between pt-6">
            <Link
              to={`/profile/${post.author._id}`}
              className="flex items-center"
            >
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
              />
              <motion.div
                variants={authorInfoVariants}
                className="ml-[-8px] text-xs"
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {post.author.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </motion.div>
            </Link>
            <Link to={`/post/slug/${post.slug}`}>
              <motion.div
                variants={readMoreVariants}
                className="flex items-center text-sky-500"
              >
                <span className="text-sm font-semibold">Read</span>
                <FiArrowRight className="ml-1" />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostCard;
