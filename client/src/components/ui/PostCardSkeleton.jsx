const PostCardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-md mb-4"></div>
      <div className="space-y-3">
        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
