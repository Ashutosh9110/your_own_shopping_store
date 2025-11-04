import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://yourownshoppingstore.netlify.app",
  "https://your-own-shopping-store.onrender.com"
];

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

// API routes
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
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("DB error:", err));
