// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendMail.js"; 

dotenv.config();


export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Register request body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.warn(`Registration failed: ${email} already exists`);
      return res.status(409).json({ message: "Email already exists" }); // 409 (Conflict)
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    res.status(201).json({
      message: `Registered successfully as ${newUser.role}`,
      user: { email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email already exists" }); 
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role, // 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};



console.log(process.env.FRONTEND_URL);


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail(
      email,
      "Reset your password - Your Own Shopping Store",
      resetURL
    );
    res.json({ message: "Password reset email sent successfully" });




  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      where: { resetToken: token },
    });

    if (
      !user ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: err.message });
  }
};
