import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getCart); // get user cart
router.post("/add", verifyToken, addToCart); // add item
router.put("/update/:itemId", verifyToken, updateCartItem); // update quantity
router.delete("/remove/:itemId", verifyToken, removeFromCart); // remove item
router.delete("/clear", verifyToken, clearCart); // clear all

export default router;
