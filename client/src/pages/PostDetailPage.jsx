import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import API from "../api";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import { format } from "date-fns";

// Import all the redesigned components
import Loader from "../components/ui/Loader";
import CommentForm from "../components/shared/CommentForm";
import CommentList from "../components/shared/CommentList";
import LikeButton from "../components/shared/LikeButton";
import SocialShare from "../components/shared/SocialShare";
import BookmarkButton from "../components/shared/BookmarkButton";
import RelatedPosts from "../components/shared/RelatedPosts";
import ReadingProgressBar from "../components/ui/ReadingProgressBar";

// --- AnimatedSection Helper ---
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

// --- The Main View Component ---
const PostView = ({ post, comments, onCommentPosted, onLikeToggle }) => {
  const [openLightbox, setOpenLightbox] = useState(false);

  const contentRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"],
  });
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.5, 1, 1, 0.5]
  );
  const contentY = useTransform(scrollYProgress, [0, 0.1], ["20px", "0px"]);

  return (
    <>
      <ReadingProgressBar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- Seamless Hero Header --- */}
        <header className="relative h-[60vh] w-full">
          <div className="absolute inset-0 overflow-hidden">
            <motion.img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-50 dark:from-gray-950" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute inset-0 mx-auto flex max-w-4xl items-end px-4 pb-12"
          >
            <div>
              {post.category && (
                <Link
                  to={`/category/${post.category._id}`}
                  className="text-sm font-bold uppercase tracking-widest text-sky-500"
                >
                  {post.category.name}
                </Link>
              )}
              <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white md:text-6xl">
                {post.title}
              </h1>
            </div>
          </motion.div>
        </header>

        {/* --- Main Content Layout --- */}
        <div className="relative bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="sticky top-20 z-30 flex items-center justify-between rounded-2xl border border-white/10 bg-white/50 p-4 shadow-lg backdrop-blur-lg dark:bg-black/50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(post.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LikeButton post={post} onLikeToggle={onLikeToggle} />
                <BookmarkButton postId={post._id} />
                <SocialShare
                  postUrl={window.location.href}
                  title={post.title}
                />
              </div>
            </motion.div>

            <motion.div
              ref={contentRef}
              style={{ opacity: contentOpacity, y: contentY }}
              onClick={(e) => {
                if (e.target.tagName === "IMG") setOpenLightbox(true);
              }}
              className="prose prose-lg mx-auto mt-12 max-w-3xl dark:prose-invert prose-img:cursor-pointer prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* --- Comments and Related Posts Sections --- */}
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <AnimatedSection className="container mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-3xl font-bold">Comments ({comments.length})</h2>
            <CommentForm
              postId={post._id}
              onCommentPosted={() => onCommentPosted(post._id)}
            />
            <CommentList comments={comments} />
          </AnimatedSection>
        </div>
        <RelatedPosts currentPostId={post._id} />
      </motion.div>

      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={[{ src: post.imageUrl }]}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .85)" } }}
      />
    </>
  );
};

// --- Data Controller Component ---
const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async (postId) => {
    try {
      const { data } = await API.get(`/api/comments/${postId}`);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/api/posts/slug/${slug}`);
        setPost(data);
        if (data._id) fetchComments(data._id);
        setError(null);
      } catch (err) {
        setError("Post not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchPost();
  }, [slug]);

  // ===================================================================
  //  THE FIX: New handler for liking posts
  // ===================================================================
  const handleLikeToggle = (updatedPost) => {
    // Merge the new 'likes' array into the existing post state
    // This prevents overwriting other potentially fresh data
    setPost((currentPost) => ({
      ...currentPost,
      likes: updatedPost.likes,
    }));
  };

  if (loading) return <Loader message="Loading article..." />;
  if (error)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <FiAlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="text-3xl font-bold text-red-600">{error}</h1>
        <Link to="/" className="mt-4 text-sky-500 hover:underline">
          &larr; Go Back Home
        </Link>
      </div>
    );

  return post ? (
    <PostView
      post={post}
      comments={comments}
      onCommentPosted={fetchComments}
      onLikeToggle={handleLikeToggle} // Pass the new, safe handler
    />
  ) : null;
};

export default PostDetailPage;
