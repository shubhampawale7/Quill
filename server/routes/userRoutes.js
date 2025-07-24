import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserDetails,
  updateUserProfile,
  toggleBookmark,
  getBookmarkedPosts,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", registerUser);
router.post("/login", loginUser);

router
  .route("/profile")
  .get(protect, getUserDetails)
  .put(protect, updateUserProfile);

router.route("/profile/bookmarks").get(protect, getBookmarkedPosts);
router.route("/profile/bookmarks/:postId").put(protect, toggleBookmark);

router.get("/:userId", getUserProfile);

export default router;
