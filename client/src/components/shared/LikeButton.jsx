import { useState, useContext, useEffect } from "react";
import API from "../../api"; // Use the new centralized API client
import { AuthContext } from "../../context/AuthContext";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";

const LikeButton = ({ post, onLikeToggle }) => {
  const { userInfo } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post.likes) {
      setLikeCount(post.likes.length);
      // Check if the current user's ID is in the likes array
      if (userInfo) {
        setIsLiked(post.likes.includes(userInfo._id));
      } else {
        setIsLiked(false); // Ensure it's not liked if user logs out
      }
    }
  }, [post.likes, userInfo]);

  const handleLike = async () => {
    if (!userInfo) {
      toast.error("You must be logged in to like a post.");
      return;
    }

    setLoading(true);
    // Optimistic UI update for a better user experience
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      // The API client automatically adds the authorization token
      const { data } = await API.put(`/api/posts/${post._id}/like`);
      onLikeToggle(data); // Update the parent component's state with the final data
    } catch (error) {
      toast.error("Failed to update like status.");
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    } finally {
      setLoading(false);
    }
  };

  const heartIconClass = isLiked
    ? "text-red-500 fill-current"
    : "text-gray-500 dark:text-gray-400";

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
    >
      <FiHeart className={heartIconClass} />
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
