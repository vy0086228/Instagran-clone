import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const connectDB = async () => {
  try {
    // Increase DNS timeout
    dns.setDefaultResultOrder("ipv4first");

    // Connection options with increased timeouts
    const options = {
      serverSelectionTimeoutMS: 10000, // Increase from 5000 to 10000
      socketTimeoutMS: 60000, // Increase from 45000 to 60000
      connectTimeoutMS: 20000, // Add explicit connect timeout
      retryWrites: true,
      maxPoolSize: 10,
      family: 4, // Force IPv4
    };

    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    // Attempt connection with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`MongoDB Connected:  ${conn.connection.host}`);

        // Set up connection event handlers
        mongoose.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
          console.warn("MongoDB disconnected");
        });

        return conn;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(
          `Connection failed, retrying... (${retries} attempts remaining)`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
