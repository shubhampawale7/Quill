import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const PostCard = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        scale={1.02}
        transitionSpeed={400}
      >
        <div className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-300 h-full flex flex-col">
          <div className="overflow-hidden">
            <Link to={`/post/slug/${post.slug}`}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            {post.category && (
              <Link
                to={`/category/${post.category._id}`}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase hover:underline self-start"
              >
                {post.category.name}
              </Link>
            )}

            <Link to={`/post/slug/${post.slug}`} className="block">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-sky-500 transition-colors">
                {post.title}
              </h3>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <Link to={`/profile/${post.author._id}`}>
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${post.author._id}`}>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:underline">
                      {post.author.name}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <FiHeart />
                <span>{post.likes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default PostCard;
