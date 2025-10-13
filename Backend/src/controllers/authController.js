// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🧍 Register User or Admin
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // default to user
    });

    return res.status(201).json({
      message: `Registered successfully as ${newUser.role}`,
      user: { email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// 🔐 Login User or Admin
export const login = async (req, res) => {
  try {
    const { email, password, loginRole } = req.body; // 👈 loginRole passed from frontend
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    // Admin login check
    if (loginRole === "admin" && user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Not an admin" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
