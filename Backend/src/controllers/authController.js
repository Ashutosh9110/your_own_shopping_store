import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendMail.js"; 
import { Op } from "sequelize";
import { sendSMS } from "../utils/sendSMS.js";
import { verifySMS } from "../utils/verifySMS.js";
import { otpTemplate } from "../utils/emailTemplates.js";

dotenv.config();


function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}


export const register = async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;
    // console.log("Register request body:", req.body);
    if (!email || !password || !phone) {
      return res.status(400).json({ message: "Email, phone & password are required" });
    }
    const existing = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }})
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });
    res.status(201).json({
      message: `Registered successfully as ${newUser.role}`,
      user: { email: newUser.email, phone: newUser.phone, role: newUser.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({
      where: { [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Wrong password" });
    if (!emailOrPhone.includes("@")) {
      const sessionId = await sendSMS(user.phone);
      if (!sessionId)
        return res.status(500).json({ message: "Failed to send OTP" });
      user.otpSessionId = sessionId;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.json({
        otpRequired: true,
        message: "OTP sent via SMS",
      });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.otpSessionId = null;
    await user.save();
    await sendMail({
      to: user.email,
      subject: "Your Login OTP",
      htmlContent: otpTemplate(otp),
    });
    res.json({ otpRequired: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    })
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    let valid = false;
    if (!emailOrPhone.includes("@")) {
      valid = await verifySMS(user.otpSessionId, otp);
    }
    else {
      valid = user.otp === otp && new Date() < new Date(user.otpExpiry);
    }
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpSessionId = null;
    user.otpExpiry = null;
    await user.save();
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};
// console.log(process.env.FRONTEND_URL);
export const resendOtp = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!emailOrPhone.includes("@")) {
      const sessionId = await sendSMS(user.phone);
      if (!sessionId)
        return res.status(500).json({ message: "Failed to resend OTP" });
      user.otpSessionId = sessionId;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.json({ message: "OTP resent via SMS" });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.otpSessionId = null;
    await user.save();
    await sendMail({
      to: user.email,
      subject: "Your OTP Code",
      htmlContent: otpTemplate(otp),
    });
    res.json({ message: "OTP resent to email" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ]
      }
    });    
    if (!user) return res.status(404).json({ message: "User not found" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    if (emailOrPhone.includes("@")) {
      await sendMail(user.email, "Reset your password", resetURL);
    } else {
      await sendSMS(user.phone, `Reset your password: ${resetURL}`);
    }
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
