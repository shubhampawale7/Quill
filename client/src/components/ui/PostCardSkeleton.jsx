const PostCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700/50 dark:bg-gray-800/60">
      {/* The Shimmer Effect */}
      <div className="animate-shimmer absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-gray-300/20 to-transparent dark:via-gray-600/20" />

      {/* The Skeleton Layout */}
      <div className="flex h-full flex-col">
        {/* Image Placeholder */}
        <div className="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

        {/* Text Placeholder */}
        <div className="mb-4 flex-grow space-y-3">
          <div className="h-6 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-5/6 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-1">
              <div className="h-3 w-20 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-2 w-24 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="h-4 w-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
