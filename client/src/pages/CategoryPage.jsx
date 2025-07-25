import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";
import { FiFolder, FiAlertTriangle } from "react-icons/fi";

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

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assumption: A better API might return category info even with 0 posts
        // e.g., { category: { name: 'Technology' }, posts: [] }
        const { data } = await API.get(`/api/posts?category=${categoryId}`);
        setPosts(data.posts);

        if (data.posts.length > 0) {
          setCategoryName(data.posts[0].category.name);
        } else {
          // Fallback: Fetch category name separately if no posts are returned
          // This makes the empty state more informative.
          try {
            const categoryRes = await API.get(`/api/categories/${categoryId}`);
            setCategoryName(categoryRes.data.name);
          } catch {
            setCategoryName("this category");
          }
        }
      } catch (err) {
        setError("Could not load posts. Please try again later.");
        console.error("Failed to fetch posts for category", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByCategory();
  }, [categoryId]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 h-24 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700/50"></div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <motion.div
        className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FiAlertTriangle className="h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Link to="/">
          <motion.button
            className="mt-4 rounded-lg bg-sky-500 px-5 py-2 font-semibold text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  // --- Main Content ---
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- Animated Header Banner --- */}
      <motion.div
        variants={itemVariants}
        className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 p-8 text-white shadow-lg md:p-12"
      >
        <div className="absolute inset-0 -z-10 bg-[url('/path-to-your/abstract-pattern.svg')] opacity-10"></div>
        <p className="text-sm font-bold uppercase tracking-widest text-sky-200">
          Category
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {categoryName}
        </h1>
      </motion.div>

      {/* --- Posts Grid or Empty State --- */}
      {posts.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/20"
        >
          <FiFolder className="h-16 w-16 text-sky-400" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              No Posts Found
            </h2>
            <p className="max-w-md text-gray-600 dark:text-gray-400">
              There are currently no articles in the "{categoryName}" category.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.div key={post._id} variants={itemVariants}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryPage;
