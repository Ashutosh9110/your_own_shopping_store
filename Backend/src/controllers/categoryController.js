import Category from "../models/Category.js";

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

const defaultCategories = [
  "Fruits",
  "Vegetables",
  "Electronics",
  "Grocery",
  "Clothing",
  "Stationery",
  "Watches",
  "Personal Care"
];

export const getCategories = async (req, res) => {
  try {
    const existing = await Category.findAll();
    const existingNames = existing.map((c) => c.name);

    const missing = defaultCategories.filter((n) => !existingNames.includes(n));
    if (missing.length > 0) {
      await Category.bulkCreate(missing.map((name) => ({ name })));
      console.log("Auto-added missing categories:", missing);
    }

    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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


