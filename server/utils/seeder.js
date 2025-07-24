import mongoose from "mongoose";
import dotenv from "dotenv";
import { samplePosts } from "../data/sampleData.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Post.deleteMany();
    await Category.deleteMany();
    await Comment.deleteMany();
    // We don't delete users to keep our login accounts

    // Find the first user to be the author of all sample posts
    const adminUser = await User.findOne();
    if (!adminUser) {
      console.error(
        "Error: No users found in the database. Please register a user first."
      );
      process.exit(1);
    }

    // Create sample categories
    const createdCategories = await Category.insertMany([
      { name: "Technology", slug: "technology" },
      { name: "Lifestyle", slug: "lifestyle" },
      { name: "Productivity", slug: "productivity" },
      { name: "Finance", slug: "finance" },
      { name: "Travel", slug: "travel" },
    ]);

    console.log("Sample categories created.");

    // Add author and category to each sample post
    const postsWithAuthorAndCategory = samplePosts.map((post, index) => {
      return {
        ...post,
        author: adminUser._id,
        // Assign categories in a round-robin fashion
        category: createdCategories[index % createdCategories.length]._id,
      };
    });

    await Post.insertMany(postsWithAuthorAndCategory);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Post.deleteMany();
    await Category.deleteMany();
    await Comment.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check for a '-d' flag in command line arguments
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
