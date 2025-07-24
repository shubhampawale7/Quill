import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api"; // Use the new centralized API client
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";

const SearchPage = () => {
  const { keyword } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(
          `/api/posts?keyword=${keyword}&pageNumber=${page}`
        );
        setPosts(data.posts);
        setPages(data.pages);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [keyword, page]);

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

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Search Results for: <span className="text-sky-500">{keyword}</span>
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No posts found matching your search.
          </p>
          <Link to="/" className="text-sky-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    page === x + 1
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
