import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";
import { FiBookmark } from "react-icons/fi";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" } },
};

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/api/users/profile/bookmarks");
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch bookmarks", error);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchBookmarks();
    }
  }, [userInfo]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10 h-10 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (posts.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <FiBookmark className="h-16 w-16 text-sky-400" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Your Reading List is Empty
          </h2>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            Click the bookmark icon on any post to save it here for later.
          </p>
        </div>
        <Link to="/">
          <motion.button
            className="rounded-lg bg-sky-500 px-6 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Posts
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  // --- Populated State ---
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          My Bookmarks
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Your personal collection of saved stories and ideas.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {posts.map((post) => (
          <motion.div key={post._id} variants={itemVariants}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BookmarksPage;
