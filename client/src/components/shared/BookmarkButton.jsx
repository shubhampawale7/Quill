import { useState, useContext, useEffect } from "react";
import API from "../../api"; // Use the new centralized API client
import { AuthContext } from "../../context/AuthContext";
import { FiBookmark } from "react-icons/fi";
import { toast } from "sonner";

const BookmarkButton = ({ postId }) => {
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.bookmarks) {
      setIsBookmarked(userInfo.bookmarks.includes(postId));
    }
  }, [userInfo, postId]);

  const handleBookmark = async () => {
    if (!userInfo) return toast.error("Please log in to save posts.");

    setLoading(true);
    setIsBookmarked(!isBookmarked); // Optimistic UI update

    try {
      // The API client automatically adds the authorization token
      const { data } = await API.put(`/api/users/profile/bookmarks/${postId}`);
      updateUserInfo({ ...userInfo, bookmarks: data }); // Update context
    } catch (error) {
      setIsBookmarked(!isBookmarked); // Revert on error
      toast.error("Failed to update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleBookmark} disabled={loading} title="Save for later">
      <FiBookmark
        className={`w-6 h-6 transition-colors ${
          isBookmarked
            ? "fill-current text-sky-500"
            : "text-gray-500 hover:text-sky-500"
        }`}
      />
    </button>
  );
};

export default BookmarkButton;
