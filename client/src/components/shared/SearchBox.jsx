import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
      setIsExpanded(false);
      inputRef.current?.blur();
    } else {
      setIsExpanded(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    collapsed: {
      width: 44,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.05)",
    },
    expanded: {
      width: 250,
      boxShadow: "0px 5px 15px rgba(14, 165, 233, 0.2)",
    },
  };

  const iconVariants = {
    rest: { rotate: 0, x: 0 },
    hover: { rotate: -15, x: 2 },
  };

  // --- Handle clicking outside to collapse ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !keyword
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [keyword]);

  return (
    <form onSubmit={submitHandler} className="relative w-full max-w-xs">
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        animate={isExpanded ? "expanded" : "collapsed"}
        initial="collapsed"
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative flex h-11 items-center justify-end rounded-full border border-white/10 bg-white/30 backdrop-blur-md dark:bg-black/30"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.input
              key="search-input"
              ref={inputRef}
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              placeholder="Search posts..."
              className="h-full w-full flex-grow bg-transparent pl-12 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:outline-none dark:text-gray-200 dark:placeholder-gray-400"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.1 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            />
          )}
        </AnimatePresence>

        <motion.button
          type={isExpanded ? "submit" : "button"}
          onClick={() => {
            setIsExpanded(true);
            inputRef.current?.focus();
          }}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full text-gray-600 dark:text-gray-300"
          whileHover="hover"
          whileTap={{ scale: 0.9 }}
          initial="rest"
          animate="rest"
        >
          <motion.div variants={iconVariants}>
            <FiSearch size={20} />
          </motion.div>
        </motion.button>
      </motion.div>
    </form>
  );
};

export default SearchBox;
