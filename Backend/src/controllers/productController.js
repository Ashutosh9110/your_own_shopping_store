import { sequelize } from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import multer from "multer";
import path from "path";
import { Op } from "sequelize";

// ==================== Multer Storage ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
export const uploadMultiple = multer({ storage });

// ==================== Create Product ====================
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    let imagesArray = [];

    if (req.files && req.files.length > 0) {
      imagesArray = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
    } else if (req.file) {
      imagesArray = [`${baseUrl}/uploads/${req.file.filename}`];
    }


    const newProduct = await Product.create({
      name,
      price,
      quantity,
      categoryId,
      image: imagesArray,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};


// ==================== Get All Products ====================
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const products = await Product.findAll({
      include: [{ model: Category, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });


    // products.forEach((p, i) => {
    //   console.log(`  #${i + 1} product name:`, p.name, "| image:", p.image);
    // });

    const normalized = products.map((p) => {
      const json = p.toJSON();
      if (!json.image) json.image = [];
      else if (!Array.isArray(json.image)) json.image = [json.image];
      return json;
    });

    res.json(normalized);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


// ==================== Get Single Product ====================
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const json = product.toJSON();
    if (!json.image) json.image = [];
    else if (!Array.isArray(json.image)) json.image = [json.image];

    res.json(json);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================== Update Product ====================
export const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId, keepExistingImages } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Replace with new uploaded images
      product.image = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
    } else if (req.file) {
      product.image = [`${baseUrl}/uploads/${req.file.filename}`];
    } else if (keepExistingImages === "true") {
      // keep current images as is
    } else if (req.body.image === "null" || req.body.image === null) {
      product.image = [];
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity ?? product.quantity;
    product.categoryId = categoryId || product.categoryId;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==================== Delete Product ====================
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
};
