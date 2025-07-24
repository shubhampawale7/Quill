import { useState, useContext } from "react";
import API from "../../api"; // Use the new centralized API client
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CommentForm = ({ postId, onCommentPosted }) => {
  const [text, setText] = useState("");
  const { userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      // The API client automatically adds the authorization token
      await API.post(`/api/comments/${postId}`, { text });
      setText("");
      toast.success("Comment posted!");
      onCommentPosted(); // This will trigger a refetch in the parent component
    } catch (error) {
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <p className="text-gray-500 dark:text-gray-400 mt-4">
        Please{" "}
        <Link to="/login" className="text-sky-500 hover:underline">
          login
        </Link>{" "}
        to comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-sky-500 focus:border-sky-500"
        rows="3"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 disabled:bg-gray-400"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;
