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
import videoRoutes from "./src/routes/videoRoutes.js";
import adminSetupRoute from "./src/routes/adminSetupRoute.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const BASE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`;

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
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions))

// Middleware
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(
//   "/uploads",
//   cors(corsOptions),
//   express.static(path.join(__dirname, "src/uploads"))
// );


// app.use("/uploads", (req, res, next) => {
//   const allowedOrigin = "https://yourownshoppingstore.netlify.app";
//   res.header("Access-Control-Allow-Origin", allowedOrigin);
//   res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
//   next();
// }, express.static(path.join(__dirname, "src/uploads")));


app.use("/uploads", (req, res, next) => {
  const allowedOrigin = "https://yourownshoppingstore.netlify.app";
  const requestOrigin = req.headers.origin;

  console.log("\n [UPLOAD REQUEST]");
  console.log("Path:", req.path);
  console.log("Full URL:", req.protocol + "://" + req.get("host") + req.originalUrl);
  console.log("Origin Header:", requestOrigin);

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  console.log("Response CORS header:", res.getHeader("Access-Control-Allow-Origin"));

  next();
}, express.static(path.join(__dirname, "src/uploads")));





// API routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin", adminSetupRoute);


// Health check route
app.get("/", (req, res) => {  
  res.json({ message: "Backend is running" });
});

sequelize
  .sync()
  .then(() => {
    console.log("Database connected & synced");
  })
  .catch((err) => console.error("DB error:", err));

  app.use((req, res, next) => {
    console.warn("404 - Not Found:", req.originalUrl);
    res.status(404).json({ message: "Route not found" });
  });


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

