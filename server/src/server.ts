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

// Database connection
dbConnect();

// Middleware
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
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
if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📊 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${env.PORT}/api`);
  });
}

export default app;
