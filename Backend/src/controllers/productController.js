// src/controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import multer from "multer";
import path from "path";

// File upload config (same)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
export const upload = multer({ storage });

// Create Product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !categoryId)
      return res.status(400).json({ message: "Missing required fields" });

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const product = await Product.create({
      name,
      price,
      quantity,
      image,
      categoryId,
    });
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

// 🧭 Get All Products (with Filter + Search)
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query; // e.g. /api/products?category=abc&search=shirt

    const whereClause = {};

    // Filter by category
    if (category) {
      const foundCategory = await Category.findOne({ where: { name: category } });
      if (foundCategory) whereClause.categoryId = foundCategory.id;
      else return res.json([]); // no products if category doesn’t exist
    }

    // Search by name
    if (search) {
      whereClause.name = { [Product.sequelize.Op.iLike]: `%${search}%` };
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [{ model: Category, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.categoryId = categoryId || product.categoryId;
    if (image) product.image = image;

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
