import express from "express";
import {
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
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// Public routes
router.route("/").get(getPosts);
router.route("/popular").get(getPopularPosts);
router.route("/slug/:slug").get(getPostBySlug);

// Private (user must be logged in)
router.route("/my-posts").get(protect, getMyPosts);
router.route("/").post(protect, createPost);

router
  .route("/:id")
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route("/:id/related").get(getRelatedPosts);
router.route("/:id/like").put(protect, toggleLikePost);

export default router;
