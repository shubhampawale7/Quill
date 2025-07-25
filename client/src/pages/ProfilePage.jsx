import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import API from "../api";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";
import {
  FiAlertTriangle,
  FiCalendar,
  FiFileText,
  FiHeart,
} from "react-icons/fi";
import { format } from "date-fns";
import { useRef } from "react";

// --- Animated Stat Counter ---
const AnimatedStat = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current)
            ref.current.textContent = Math.round(latest).toLocaleString();
        },
      });
    }
  }, [isInView, value]);

  return <span ref={ref} />;
};

// --- Tab Button Component ---
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="relative px-4 py-2 text-sm font-semibold transition-colors focus:outline-none"
  >
    <span
      className={
        isActive
          ? "text-sky-500"
          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      }
    >
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="profile-tab-underline"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"
      />
    )}
  </button>
);

// --- Post Grid Component ---
const PostGrid = ({ posts, emptyMessage }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" } },
  };

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <motion.div key={post._id} variants={itemVariants}>
          <PostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
};

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get(`/api/users/${userId}`);
        setProfile(data);
        // Assuming your user profile API returns liked posts, or you'd make another call
        if (data.user.likedPosts) setLikedPosts(data.user.likedPosts);
      } catch (err) {
        setError("This profile could not be found.");
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchProfile();
  }, [userId]);

  if (loading) {
    /* Skeleton Loader remains the same */
  }
  if (error) {
    /* Error State remains the same */
  }
  if (!profile) return null;

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* --- Unified Header Banner --- */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/30 p-8 shadow-2xl backdrop-blur-lg dark:bg-black/30"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.img
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            src={
              profile.user.avatarUrl ||
              `https://i.pravatar.cc/150?u=${profile.user._id}`
            }
            alt={profile.user.name}
            className="h-32 w-32 rounded-full border-4 border-white/50 object-cover shadow-2xl"
          />
          <div className="flex-grow">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              {profile.user.name}
            </h1>
            {profile.user.bio && (
              <p className="mx-auto mt-2 max-w-xl text-gray-700 dark:text-gray-300">
                {profile.user.bio}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center">
              <div className="flex items-center gap-2 text-lg font-bold text-sky-500">
                <FiFileText />{" "}
                <span>
                  <AnimatedStat value={profile.posts.length} /> Posts
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg font-bold text-sky-500">
                <FiHeart />{" "}
                <span>
                  <AnimatedStat value={likedPosts.length} /> Likes
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiCalendar />{" "}
                <span>
                  Joined {format(new Date(profile.user.createdAt), "MMMM yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Tab Navigation --- */}
      <div className="mt-12 border-b border-gray-200 dark:border-gray-800">
        <nav className="flex justify-center -mb-px space-x-6">
          <TabButton
            label="Posts"
            isActive={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          />
          <TabButton
            label="Likes"
            isActive={activeTab === "likes"}
            onClick={() => setActiveTab("likes")}
          />
        </nav>
      </div>

      {/* --- Tab Content --- */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "posts" && (
              <PostGrid
                posts={profile.posts}
                emptyMessage="This user hasn't published any posts yet."
              />
            )}
            {activeTab === "likes" && (
              <PostGrid
                posts={likedPosts}
                emptyMessage="This user hasn't liked any posts yet."
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
