/*import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "hello dhreej , yashir ,....",
    success: true,
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});


import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// Health check route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "hello dhreej , yashir ,....",
    success: true,
  });
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server function
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    console.log("Database connected successfully");

    // Then start the server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Initialize server
startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Close server & exit process
  process.exit(1);
});
*/

// index.js (main application file)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import isAuthenticated from "./middlewares/isAuthenticated.js";

// Import models first
import "./models/user.model.js";
import "./models/post.model.js"; // Make sure you have this file
import "./models/message.model.js"; // Make sure you have this file

// Then import routes
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use("/protected-route", isAuthenticated, (req, res) => {
  res.send("You are authenticated!");
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
