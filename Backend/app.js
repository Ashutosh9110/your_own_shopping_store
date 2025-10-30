  // app.js

  // const express = require("express")
  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import { sequelize, connectDB } from "./src/config/db.js";
  import authRoutes from "./src/routes/authRoutes.js";
  import categoryRoutes from "./src/routes/categoryRoutes.js";
  import productRoutes from "./src/routes/productRoutes.js";
  import orderRoutes from "./src/routes/orderRoutes.js";
  import cartRoutes from "./src/routes/cartRoutes.js";
  import paymentRoutes from "./src/routes/paymentRoutes.js";
  import userRoutes from "./src/routes/userRoutes.js";


  dotenv.config();
  const app = express();

  app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }));

  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow non-browser clients
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
  app.use("/uploads", express.static("src/uploads"));

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/users", userRoutes);
  

  sequelize
    .sync()
    .then(() => {
      console.log("Database connected & synced");
      app.listen(process.env.PORT || 5000, () =>
        console.log(`Server running on port ${process.env.PORT || 5000}`)
      );
    })
    .catch((err) => console.error("DB error:", err));
