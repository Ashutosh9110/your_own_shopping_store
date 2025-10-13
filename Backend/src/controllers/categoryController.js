import Category from "../models/Category.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
