import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api";
import { FiSearch, FiCornerDownLeft } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// --- Animated SVG Loader ---
const SearchLoader = () => (
  <motion.div
    key="loader"
    className="flex flex-col items-center justify-center p-16 text-center text-gray-500"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM16 16l4.5 4.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
    <p className="mt-4 text-sm">Searching...</p>
  </motion.div>
);

const SearchModal = ({ closeModal }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        handleResultClick(results[activeIndex].slug);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, results, activeIndex]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim() === "") {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await API.get(`/api/posts?keyword=${debouncedQuery}`);
        setResults(data.posts);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
    setActiveIndex(0);
  }, [debouncedQuery]);

  const handleResultClick = (slug) => {
    closeModal();
    navigate(`/post/slug/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[15vh] backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-gray-900/80"
      >
        <div className="flex items-center border-b border-gray-200 p-4 dark:border-gray-700">
          <FiSearch className="h-6 w-6 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for posts..."
            className="w-full bg-transparent p-2 text-lg text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <SearchLoader />
            ) : results.length > 0 ? (
              <motion.ul key="results" className="p-2">
                {results.map((post, index) => (
                  <li
                    key={post._id}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleResultClick(post.slug)}
                    className="relative cursor-pointer rounded-lg p-3"
                  >
                    {activeIndex === index && (
                      <motion.div
                        layoutId="search-highlight"
                        className="absolute inset-0 bg-sky-100 dark:bg-sky-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      />
                    )}
                    <div className="relative">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {post.author.name} •{" "}
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </motion.ul>
            ) : query ? (
              <motion.div
                key="no-results"
                className="p-16 text-center text-gray-500"
              >
                No results found for "{query}"
              </motion.div>
            ) : (
              <motion.div
                key="initial"
                className="p-16 text-center text-gray-500"
              >
                Start typing to search.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-2 text-xs text-gray-500 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
              ↑
            </span>
            <span className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
              ↓
            </span>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
              <FiCornerDownLeft size={10} />
            </span>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
              ESC
            </span>
            <span>to close</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;
