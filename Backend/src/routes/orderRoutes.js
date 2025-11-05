import express from "express";
import { placeOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, placeOrder); 
router.get("/my-orders", verifyToken, getUserOrders); 
router.get("/:id", verifyToken, getOrderById); 

// admin only
router.get("/", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

export default router;
