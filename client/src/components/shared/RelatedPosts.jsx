import { useState, useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import API from "../../api";
import PostCard from "./PostCard";
import PostCardSkeleton from "../ui/PostCardSkeleton";

const RelatedPosts = ({ currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Ref and hook for horizontal scroll progress ---
  const scrollContainerRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: scrollContainerRef });

  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentPostId) return;
      setLoading(true);
      try {
        const { data } = await API.get(`/api/posts/${currentPostId}/related`);
        setRelatedPosts(data);
      } catch (error) {
        console.error("Failed to fetch related posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentPostId]);

  if (!loading && relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* --- Redesigned Section Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Continue Your Journey
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Discover more stories and ideas you'll love.
          </p>
        </motion.div>

        {/* --- Horizontal Scrolling Showcase --- */}
        <div
          ref={scrollContainerRef}
          className="mt-8 flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading
            ? // --- Horizontal Skeleton Loader ---
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-80 flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <PostCardSkeleton />
                </div>
              ))
            : // --- Related Posts ---
              relatedPosts.map((post) => (
                <div
                  key={post._id}
                  className="w-80 flex-shrink-0 transition-opacity hover:opacity-90"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <PostCard post={post} />
                </div>
              ))}
        </div>

        {/* --- Horizontal Scroll Progress Bar --- */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-1 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
            style={{ scaleX: scrollXProgress, transformOrigin: "left" }}
          />
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
