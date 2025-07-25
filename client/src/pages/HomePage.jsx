import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import API from "../api";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";
import { toast } from "sonner";
import { FiLoader } from "react-icons/fi";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" } },
};

const AnimatedSection = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.section>
  );
};

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // --- Infinite Scroll Logic ---
  const loadMoreRef = useRef(null);
  const isLoadMoreInView = useInView(loadMoreRef, { margin: "200px" });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [postsData, popularData] = await Promise.all([
          API.get(`/api/posts?pageNumber=1`),
          API.get(`/api/posts/popular`),
        ]);
        setPosts(postsData.data.posts);
        setPages(postsData.data.pages);
        setPopularPosts(popularData.data);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
        toast.error("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const loadMoreHandler = async () => {
    const nextPage = page + 1;
    if (nextPage > pages || loadingMore) return;

    setLoadingMore(true);
    try {
      const { data } = await API.get(`/api/posts?pageNumber=${nextPage}`);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setPage(nextPage);
    } catch (err) {
      toast.error("Failed to load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isLoadMoreInView) {
      loadMoreHandler();
    }
  }, [isLoadMoreInView]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-24 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700/50 mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-500">
          An Error Occurred
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const featuredPost = popularPosts?.[0];
  const otherPopularPosts = popularPosts?.slice(1, 5);

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* --- Hero Section --- */}
      <motion.div variants={itemVariants} className="text-center py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to Quill
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A beautifully crafted space for writers and readers. Discover stories,
          thinking, and expertise from writers on any topic.
        </p>
      </motion.div>

      {/* --- Featured Post Section --- */}
      {featuredPost && (
        <AnimatedSection className="mb-20">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            <PostCard post={featuredPost} isFeatured={true} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {otherPopularPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      )}

      {/* --- Latest Posts Section --- */}
      <AnimatedSection>
        <motion.h2
          variants={itemVariants}
          className="mb-8 text-3xl font-bold text-gray-900 dark:text-white"
        >
          Latest Posts
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </AnimatedSection>

      {/* --- Infinite Scroll Trigger & Loader --- */}
      <div ref={loadMoreRef} className="flex h-20 items-center justify-center">
        {loadingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <FiLoader className="animate-spin" />
            <span>Loading more posts...</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;
