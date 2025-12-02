import { sequelize } from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";


// ==================== Create Product ====================
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, categoryId } = req.body;

    let imagesArray = [];

    if (req.files && req.files.length > 0) {
      imagesArray = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename
      }));
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
    const { name, price, quantity, categoryId, keepExistingImages, removeImages } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updatedImages = product.image || [];

    // Remove selected images
    if (removeImages && Array.isArray(JSON.parse(removeImages))) {
      const removeList = JSON.parse(removeImages);

      for (const public_id of removeList) {
        await cloudinary.uploader.destroy(public_id);   // delete from Cloudinary
        updatedImages = updatedImages.filter(img => img.public_id !== public_id);
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename
      }));

      updatedImages = [...updatedImages, ...newImages];
    }

    // Optionally remove all images
    if (keepExistingImages === "false" && !req.files?.length) {
      // delete all cloudinary images
      for (const img of updatedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      updatedImages = [];
    }

    // Save updates
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.categoryId = categoryId ?? product.categoryId;
    product.image = updatedImages;

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==================== Delete Product ====================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all Cloudinary images
    if (product.image && Array.isArray(product.image)) {
      for (const img of product.image) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
};

