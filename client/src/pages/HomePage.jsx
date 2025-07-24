import { useState, useEffect } from "react";
import API from "../api";
import PostCard from "../components/shared/PostCard";
import PostCardSkeleton from "../components/ui/PostCardSkeleton";
import { toast } from "sonner";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [postsData, popularData] = await Promise.all([
          API.get(`/api/posts?pageNumber=1`),
          API.get(`/api/posts/popular`),
        ]);
        setPosts(postsData.data.posts);
        setPages(postsData.data.pages);
        setPopularPosts(popularData.data);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const loadMoreHandler = async () => {
    const nextPage = page + 1;
    if (nextPage <= pages) {
      setLoadingMore(true);
      try {
        const { data } = await API.get(`/api/posts?pageNumber=${nextPage}`);
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setPage(nextPage);
      } catch (err) {
        toast.error("Failed to load more posts.");
      } finally {
        setLoadingMore(false);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <div className="text-center py-16 animate-pulse">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mx-auto"></div>
        </div>
        <section>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to Quill
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A beautifully crafted space for writers and readers. Discover stories,
          thinking, and expertise from writers on any topic.
        </p>
      </div>
      {popularPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 border-l-4 border-sky-500 pl-4">
            Popular Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-sky-500 pl-4">
          Latest Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>
      {page < pages && (
        <div className="text-center mt-12">
          <button
            onClick={loadMoreHandler}
            disabled={loadingMore}
            className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-400"
          >
            {loadingMore ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
