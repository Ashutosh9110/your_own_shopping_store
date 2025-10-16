import express from "express";
import { createCategory, getCategories, deleteCategory, seedDefaultCategories } from "../controllers/categoryController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createCategory);
router.get("/", getCategories);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);
router.post("/seed", verifyToken, isAdmin, seedDefaultCategories);


export default router;
