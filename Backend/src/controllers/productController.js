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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));    
  },
});

export const upload = multer({ storage });
export const uploadMultiple = multer({ storage });

// ==================== Create Product ====================
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;

    const backendUrl =
    process.env.BACKEND_PUBLIC_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `${req.protocol}://${req.get("host")}`;
  
  const baseUrl = backendUrl.replace(/\/$/, "");
  
    let imagesArray = [];

    if (req.files?.length > 0) {
      imagesArray = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
    } else if (req.file) {
      imagesArray = [`${baseUrl}/uploads/${req.file.filename}`];
    }
console.log("Computed backend URL:", backendUrl);
console.log("Saving image URL:", `${backendUrl}/uploads/${req.file?.filename}`);

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

    const whereClause = {};
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
      const normalizedCategory = category.toLowerCase().replace(/[\s-]+/g, "")
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

    const normalized = products.map((p) => {
      const json = p.toJSON();
      if (!json.image) json.image = [];
      else if (!Array.isArray(json.image)) json.image = [json.image];
      return json;
    });
    res.json(normalized);
  } catch (err) {
    console.error("Error fetching products:", err);
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

    const backendUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.BACKEND_PUBLIC_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://your-own-shopping-store.onrender.com"
        : `${req.protocol}://${req.get("host")}`);
  
    
    const baseUrl = backendUrl.replace(/\/$/, "");

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
