import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
  animate,
} from "framer-motion";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFilePlus,
  FiBarChart2,
  FiEye,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";
import { format } from "date-fns";

// --- Animated Stat Counter (with fix) ---
const AnimatedStat = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      // Store the animation controls
      const animation = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          // Check ref.current again inside onUpdate for safety
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toLocaleString();
          }
        },
      });
      // Return a cleanup function to stop the animation on unmount
      return () => animation.stop();
    }
  }, [isInView, value]);

  return <span ref={ref} />;
};

// --- Skeleton Loader for the new layout ---
const DashboardSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-10 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="lg:col-span-3 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// --- Expanding Post Row Component ---
const PostRow = ({ post, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/20 p-4 shadow-lg backdrop-blur-md dark:bg-black/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            {post.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(post.createdAt), "'Published on' MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/admin/post/edit/${post._id}`}>
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-sky-100 hover:text-sky-600 dark:text-gray-300 dark:hover:bg-sky-500/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiEdit size={18} />
            </motion.div>
          </Link>
          <motion.button
            onClick={() => onDelete(post._id)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-500/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiTrash2 size={18} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden border-t border-white/10 pt-4 dark:border-black/20"
          >
            <div className="flex items-start gap-6">
              <img
                src={post.imageUrl}
                alt="Preview"
                className="h-24 w-32 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiEye /> <span>{post.views || 0} Views</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiHeart /> <span>{post.likes?.length || 0} Likes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiMessageSquare />{" "}
                  <span>{post.comments?.length || 0} Comments</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Dashboard Page ---
const AdminDashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await API.get("/api/posts/my-posts");
        setPosts(data);
      } catch (error) {
        toast.error("Failed to fetch your posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [userInfo]);

  const handleDelete = async (id) => {
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const originalPosts = posts;
          setPosts(posts.filter((post) => post._id !== id));
          try {
            await API.delete(`/api/posts/${id}`);
            toast.success("Post deleted successfully");
          } catch (error) {
            setPosts(originalPosts);
            toast.error(
              error?.response?.data?.message || "Failed to delete post."
            );
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
      >
        Dashboard
      </motion.h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* --- Sidebar --- */}
        <motion.aside variants={itemVariants} className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-white/10 bg-white/20 p-6 shadow-lg backdrop-blur-md dark:bg-black/20">
            <Link to="/admin/post/new">
              <motion.button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20"
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus /> Create New Post
              </motion.button>
            </Link>
            <div className="border-t border-white/10 pt-6 dark:border-black/20">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <FiBarChart2 /> Statistics
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Posts
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    <AnimatedStat value={posts.length} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* --- Main Content: Post List --- */}
        <motion.main variants={itemVariants} className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Posts
          </h2>
          <div className="mt-6">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-gray-300 bg-white/10 p-12 text-center backdrop-blur-sm dark:border-gray-700">
                <FiFilePlus className="h-16 w-16 text-sky-400" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  No Posts Yet
                </h3>
                <p className="max-w-md text-gray-600 dark:text-gray-400">
                  Click 'Create New Post' to get started.
                </p>
              </div>
            ) : (
              <motion.div layout className="space-y-4">
                <AnimatePresence>
                  {posts.map((post) => (
                    <PostRow
                      key={post._id}
                      post={post}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.main>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
