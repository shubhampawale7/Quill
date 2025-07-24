import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/api/posts?category=${categoryId}`);
        setPosts(data.posts);
        // Set the category name from the first post in the results
        if (data.posts.length > 0) {
          setCategoryName(data.posts[0].category.name);
        } else {
          // If no posts, we could fetch the category name separately,
          // but for now, we'll handle it in the UI.
          setCategoryName("this category");
        }
      } catch (err) {
        setError("Failed to fetch posts for this category.");
        console.error("Failed to fetch posts for category", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Posts in: <span className="text-sky-500">{categoryName}</span>
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No posts found in this category yet.
          </p>
          <Link to="/" className="text-sky-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
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

export default CategoryPage;
