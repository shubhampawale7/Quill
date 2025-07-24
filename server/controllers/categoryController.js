import Category from "../models/Category.js";

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/ /g, "-");

  const categoryExists = await Category.findOne({ slug });

  if (categoryExists) {
    res.status(400).json({ message: "Category already exists" });
    return;
  }

  const category = await Category.create({ name, slug });
  res.status(201).json(category);
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

export { createCategory, getCategories };
