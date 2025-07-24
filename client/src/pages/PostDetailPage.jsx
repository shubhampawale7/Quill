import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { FiArrowLeft } from "react-icons/fi";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Loader from "../components/ui/Loader";
import CommentForm from "../components/shared/CommentForm";
import CommentList from "../components/shared/CommentList";
import LikeButton from "../components/shared/LikeButton";
import SocialShare from "../components/shared/SocialShare";
import BookmarkButton from "../components/shared/BookmarkButton";
import RelatedPosts from "../components/shared/RelatedPosts";

const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLightbox, setOpenLightbox] = useState(false);

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
        if (data._id) {
          fetchComments(data._id);
        }
        setError(null);
      } catch (err) {
        setError("Post not found.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">{error}</h1>
        <Link to="/" className="text-sky-500 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    post && (
      <>
        <article className="max-w-4xl mx-auto py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 mb-8 transition-colors"
          >
            <FiArrowLeft />
            <span>Back to all posts</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.author._id}`}>
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
                <Link to={`/profile/${post.author._id}`}>
                  <span className="hover:underline">{post.author.name}</span>
                </Link>
              </div>
              <span>•</span>
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
              {post.category && (
                <>
                  <span>•</span>
                  <Link
                    to={`/category/${post.category._id}`}
                    className="hover:underline hover:text-sky-500"
                  >
                    {post.category.name}
                  </Link>
                </>
              )}
            </div>
          </div>

          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto md:h-[450px] object-cover rounded-2xl mb-12 shadow-lg cursor-pointer"
            onClick={() => setOpenLightbox(true)}
          />

          <div
            className="prose dark:prose-invert prose-lg max-w-none prose-sky"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <LikeButton
                post={post}
                onLikeToggle={(updatedPost) => setPost(updatedPost)}
              />
              <BookmarkButton postId={post._id} />
            </div>
            <SocialShare postUrl={window.location.href} title={post.title} />
          </div>
        </article>

        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={[{ src: post.imageUrl, alt: post.title }]}
        />

        <section className="max-w-4xl mx-auto py-8">
          <hr className="my-6 border-gray-200 dark:border-gray-700" />
          <h2 className="text-3xl font-bold mb-4">
            Comments ({comments.length})
          </h2>
          <CommentForm
            postId={post._id}
            onCommentPosted={() => fetchComments(post._id)}
          />
          <CommentList comments={comments} />
        </section>

        <RelatedPosts currentPostId={post._id} />
      </>
    )
  );
};

export default PostDetailPage;
