import express from "express";
import {
  placeOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, placeOrder); // user places order
router.get("/my-orders", verifyToken, getUserOrders); // user order history
router.get("/:id", verifyToken, getOrderById); // single order detail

// admin only
router.get("/", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

export default router;
