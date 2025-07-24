import User from "../models/User.js";
import Post from "../models/Post.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await User.create({ name, email, password });
  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bookmarks: user.bookmarks,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      bookmarks: user.bookmarks,
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ author: req.params.userId })
      .populate("category", "name slug")
      .populate("author", "name avatarUrl")
      .sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio ?? user.bio;
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
      bookmarks: updatedUser.bookmarks,
      token: generateToken(res, updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const toggleBookmark = async (req, res) => {
  const user = await User.findById(req.user._id);
  const postId = req.params.postId;
  if (user.bookmarks.includes(postId)) {
    user.bookmarks.pull(postId);
  } else {
    user.bookmarks.push(postId);
  }
  await user.save();
  res.json(user.bookmarks);
};

const getBookmarkedPosts = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "bookmarks",
    populate: [
      { path: "author", select: "name avatarUrl" },
      { path: "category", select: "name slug" },
    ],
  });
  res.json(user.bookmarks);
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  getUserDetails,
  updateUserProfile,
  toggleBookmark,
  getBookmarkedPosts,
};
