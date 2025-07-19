import mongoose from "mongoose";
import { env } from "../config/environment";

export async function dbConnect(): Promise<void> {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Database already connected");
      return;
    }

    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    // Connect to MongoDB with options for better performance and reliability
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log(
      `✅ Database connected successfully to: ${
        env.MONGODB_URI.split("@")[1] || "MongoDB"
      }`
    );

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("❌ Database connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Database disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 Database reconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        "📦 Database connection closed due to application termination"
      );
      process.exit(0);
    });
  } catch (error: any) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
}
