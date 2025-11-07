// src/controllers/productController.js
import { sequelize } from "../config/db.js"; 
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import multer from "multer";
import path from "path";
import { Op } from "sequelize";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });

export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !categoryId)
      return res.status(400).json({ message: "Missing required fields" });

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const newProduct  = await Product.create({
      name,
      price,
      quantity,
      image: imagePath,
      categoryId,
    });
    res.status(201).json(newProduct);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({
        message: "Failed to create product",
        error: err.message,
      });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Base filter object
    const whereClause = {};

    // Search filter
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    };

      if (category) {
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, "");
      
        queryOptions.include[0].where = sequelize.where(
          sequelize.fn(
            "REPLACE",
            sequelize.fn("LOWER", sequelize.col("Category.name")),
            " ",
            ""
          ),
          normalizedCategory
        );
      } 

    const products = await Product.findAll(queryOptions);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};




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

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
