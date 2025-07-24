import Post from "../models/Post.js";
import User from "../models/User.js";

// @desc    Fetch all posts (with search and pagination) - Public
const getPosts = async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  try {
    const count = await Post.countDocuments({ ...keyword, ...category });
    const posts = await Post.find({ ...keyword, ...category })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category", "name slug")
      .populate("author", "name avatarUrl");
    res.json({ posts, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get logged in user's posts - Private
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get top 4 popular posts - Public
const getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ likeCount: -1 })
      .limit(4)
      .populate("author", "name avatarUrl")
      .populate("category", "name slug");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch a single post by slug - Public
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("author", "name avatarUrl");
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch a single post by ID (for editing) - Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new post - Private
const createPost = async (req, res) => {
  const { title, slug, excerpt, content, imageUrl, category } = req.body;
  const post = new Post({
    title,
    slug,
    excerpt,
    content,
    imageUrl,
    category,
    author: req.user._id,
  });
  try {
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a post - Private
const updatePost = async (req, res) => {
  const { title, slug, excerpt, content, imageUrl, category } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "User not authorized" });
      }
      post.title = title || post.title;
      post.slug = slug || post.slug;
      post.excerpt = excerpt || post.excerpt;
      post.content = content || post.content;
      post.imageUrl = imageUrl || post.imageUrl;
      post.category = category || post.category;
      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a post - Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "User not authorized" });
      }
      await post.deleteOne();
      res.json({ message: "Post removed" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Like/Unlike a post - Private
const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    post.likeCount = post.likes.length;
    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate("category", "name slug")
      .populate("author", "name avatarUrl");
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get related posts by category
// @route   GET /api/posts/:id/related
// @access  Public
const getRelatedPosts = async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.id);
    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find 3 other posts in the same category, excluding the current post
    const relatedPosts = await Post.find({
      category: currentPost.category,
      _id: { $ne: req.params.id }, // $ne means "not equal"
    })
      .limit(3)
      .populate("author", "name avatarUrl")
      .populate("category", "name slug");

    res.json(relatedPosts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export {
  getPosts,
  getMyPosts,
  getPopularPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  getRelatedPosts,
};
