import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";

// --- Reusable, Animated Pagination Component ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-2 mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-gray-600 disabled:opacity-50 dark:bg-black/20 dark:text-gray-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiChevronLeft />
      </motion.button>

      {pageNumbers.map((num, index) =>
        num === "..." ? (
          <span key={index} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <motion.button
            key={index}
            onClick={() => onPageChange(num)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-colors ${
              currentPage === num
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {num}
          </motion.button>
        )
      )}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-gray-600 disabled:opacity-50 dark:bg-black/20 dark:text-gray-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiChevronRight />
      </motion.button>
    </motion.div>
  );
};

// --- Search Sidebar Component ---
const SearchSidebar = ({ currentKeyword }) => {
  const [newKeyword, setNewKeyword] = useState("");
  const navigate = useNavigate();

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (newKeyword.trim() && newKeyword.trim() !== currentKeyword) {
      navigate(`/search/${newKeyword}`);
      setNewKeyword("");
    }
  };

  return (
    <div className="sticky top-24 space-y-6 rounded-2xl border border-white/10 bg-white/20 p-6 shadow-lg backdrop-blur-md dark:bg-black/20">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Refine Search
      </h3>
      <form onSubmit={handleNewSearch}>
        <div className="relative">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="New search..."
            className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 pl-10 text-sm focus:border-sky-500 focus:outline-none dark:bg-gray-800"
          />
          <button
            type="submit"
            className="absolute left-0 top-0 flex h-full w-10 items-center justify-center text-gray-400"
          >
            <FiSearch />
          </button>
        </div>
      </form>
      <div className="border-t border-white/10 pt-4 dark:border-black/20">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing results for:
        </p>
        <p className="mt-1 truncate font-semibold text-sky-500">
          "{currentKeyword}"
        </p>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const { keyword } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get(
          `/api/posts?keyword=${keyword}&pageNumber=${page}`
        );
        setPosts(data.posts);
        setPages(data.pages);
        setTotalPosts(data.count);
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [keyword, page]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" } },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1 h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700/50"></div>
          <div className="lg:col-span-3">
            <div className="mb-8 h-24 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700/50"></div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center"
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

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* --- Sidebar --- */}
        <motion.aside variants={itemVariants} className="lg:col-span-1">
          <SearchSidebar currentKeyword={keyword} />
        </motion.aside>

        {/* --- Main Content --- */}
        <motion.main variants={itemVariants} className="lg:col-span-3">
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/20 p-6 shadow-lg backdrop-blur-md dark:bg-black/20">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Search Results
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Found <span className="font-bold text-sky-500">{totalPosts}</span>{" "}
              matching articles.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-gray-300 bg-white/10 p-12 text-center backdrop-blur-sm dark:border-gray-700">
              <FiSearch className="h-16 w-16 text-sky-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                No Results Found
              </h2>
              <p className="max-w-md text-gray-600 dark:text-gray-400">
                Try a different search term in the sidebar to find what you're
                looking for.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2" // Changed to 2 columns for better readability
              >
                {posts.map((post) => (
                  <motion.div key={post._id} variants={itemVariants}>
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {pages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pages}
              onPageChange={setPage}
            />
          )}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default SearchPage;
