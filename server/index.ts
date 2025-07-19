const express = require("express");
const session = require("express-session");
const cors = require("cors");
import type { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import "./src/types/session"; // Import session type extensions
import { dbConnect } from "./src/db/dbconnect";

// Import routes
import authRoutes from "./src/routes/auth";
import productRoutes from "./src/routes/products";
import categoryRoutes from "./src/routes/categories";
import vendorRoutes from "./src/routes/vendors";
import cartRoutes from "./src/routes/cart";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
dbConnect();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "kifaru-crafts-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/cart", cartRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "KifaruCrafts API Server",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", error);
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;
