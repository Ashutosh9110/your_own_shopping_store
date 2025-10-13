import express from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, upload } from "../controllers/productController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", verifyToken, isAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
