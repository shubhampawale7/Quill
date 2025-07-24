import { useState, useEffect } from "react";
import API from "../../api"; // Use the new centralized API client
import PostCard from "./PostCard";

const RelatedPosts = ({ currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (currentPostId) {
        try {
          const { data } = await API.get(`/api/posts/${currentPostId}/related`);
          setRelatedPosts(data);
        } catch (error) {
          console.error("Failed to fetch related posts");
        }
      }
    };
    fetchRelated();
  }, [currentPostId]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto py-8">
      <hr className="my-6 border-gray-200 dark:border-gray-700" />
      <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
