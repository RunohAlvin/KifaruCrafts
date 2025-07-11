import express from "express";
import { setupVite, serveStatic } from "./vite";
import { registerRoutes } from "./routes";

const app = express();

// Middleware for parsing JSON and URL-encoded bodies with increased size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Register API routes
const server = await registerRoutes(app);

// Set up Vite or serve static files
if (process.env.NODE_ENV === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Kifaru Crafts Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`🔗 Frontend: http://localhost:${PORT}`);
  }
});

export default app;