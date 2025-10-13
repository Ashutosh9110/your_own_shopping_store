import express from "express";
import { getProfile, updateProfile, addAddress, getAddresses, deleteAddress } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // middleware to protect routes

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

router.post("/address", verifyToken, addAddress);
router.get("/addresses", verifyToken, getAddresses);
router.delete("/address/:id", verifyToken, deleteAddress);

export default router;
