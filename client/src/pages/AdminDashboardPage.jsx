import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api"; // Use the new centralized API client
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Loader from "../components/ui/Loader";

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
        // The API client automatically adds the token from localStorage
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
          try {
            // The API client automatically adds the token
            await API.delete(`/api/posts/${id}`);
            toast.success("Post deleted successfully");
            setPosts(posts.filter((post) => post._id !== id));
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Failed to delete post."
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Posts</h1>
        <Link
          to="/admin/post/new"
          className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-2"
        >
          <FiPlus /> Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You have not created any posts yet. Click "Create New Post" to get
          started!
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/post/edit/${post._id}`}
                      className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-200 mr-4"
                    >
                      <FiEdit size={18} className="inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                    >
                      <FiTrash2 size={18} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
