const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <p className="mt-6 text-gray-500">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{comment.user?.name || "User"}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-gray-800 dark:text-gray-300">
              {comment.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
