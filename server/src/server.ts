import express from "express";
import session from "express-session";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { env, validateEnvironment } from "./config/environment";
import { dbConnect } from "./db/dbconnect";

// Import routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import vendorRoutes from "./routes/vendors";
import cartRoutes from "./routes/cart";

// Validate environment variables
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;
// Database connection
dbConnect();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev server default port
    "http://localhost:3000", // Alternative dev port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://kifarucrafts.onrender.com", // Production frontend
    "https://localhost:5173", // HTTPS local dev
  ],
  credentials: true, // Allow credentials (cookies, sessions)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
};

// Middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: env.NODE_ENV === "production" ? "strict" : "lax", // CORS-friendly in development
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
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", error);
  res.status(500).json({
    message: "Internal server error",
    ...(env.NODE_ENV === "development" && { error: error.message }),
  });
});

// Start server
// if (process.env.NODE_ENV !== "test") {
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 API Base URL: http://localhost:${env.PORT}/api`);
});
// }
