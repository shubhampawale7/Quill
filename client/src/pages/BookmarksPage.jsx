import { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/shared/PostCard";
import Loader from "../components/ui/Loader";

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await API.get("/api/users/profile/bookmarks");
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch bookmarks", error);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchBookmarks();
    }
  }, [userInfo]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Bookmarks</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You have no saved posts. You can bookmark a post from its detail page.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
