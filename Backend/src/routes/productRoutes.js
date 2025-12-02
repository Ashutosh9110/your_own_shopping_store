import express from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { uploadMultiple } from "../config/multerCloud.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", verifyToken, isAdmin, uploadMultiple.array("images", 5), createProduct);
router.put("/:id", verifyToken, isAdmin, uploadMultiple.array("images", 5), updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
