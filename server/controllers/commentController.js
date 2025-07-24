import Comment from "../models/Comment.js";

// @desc    Create a new comment
// @route   POST /api/comments/:postId
// @access  Private
const createComment = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  if (!text) {
    res.status(400).json({ message: "Comment text is required" });
    return;
  }

  const comment = new Comment({
    text,
    post: postId,
    user: req.user._id,
  });

  try {
    const createdComment = await comment.save();
    // Populate user details before sending back
    const populatedComment = await Comment.findById(
      createdComment._id
    ).populate("user", "name");
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: "Failed to create comment" });
  }
};

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name") // Only get the user's name
      .sort({ createdAt: "desc" }); // Newest first
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { createComment, getCommentsForPost };
