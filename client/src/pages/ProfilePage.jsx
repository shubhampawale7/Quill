import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api"; // Use the new centralized API client
import PostCard from "../components/shared/PostCard";
import Loader from "../components/ui/Loader";

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/api/users/${userId}`);
        setProfile(data);
      } catch (err) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      {profile && (
        <>
          <div className="text-center py-12">
            <img
              src={
                profile.user.avatarUrl ||
                `https://i.pravatar.cc/150?u=${profile.user._id}`
              }
              alt={profile.user.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-sky-500 object-cover"
            />
            <h1 className="text-4xl font-bold">{profile.user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {profile.user.email}
            </p>
            <p className="max-w-xl mx-auto mt-2 text-gray-600 dark:text-gray-300">
              {profile.user.bio}
            </p>
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <h2 className="text-3xl font-bold mb-8">
            Posts by {profile.user.name} ({profile.posts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
