import { config } from "dotenv";

// Load environment variables
config();

// Environment configuration with validation
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "",
  SESSION_SECRET: process.env.SESSION_SECRET || "kifaru-crafts-secret-key",
} as const;

// Validate required environment variables
export function validateEnvironment(): void {
  const requiredVars = ["MONGODB_URI"] as const;

  for (const varName of requiredVars) {
    if (!env[varName]) {
      throw new Error(
        `Environment variable ${varName} is required but not defined`
      );
    }
  }

  console.log(`🔧 Environment: ${env.NODE_ENV}`);
  console.log(`🔌 Port: ${env.PORT}`);
  console.log(
    `🗄️ Database: ${env.MONGODB_URI ? "✅ Configured" : "❌ Missing"}`
  );
}
