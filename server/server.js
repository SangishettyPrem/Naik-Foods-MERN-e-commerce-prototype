const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middlewares/errorHandler");

// Route imports
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const pincodeRoutes = require("./src/routes/pincodeRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server) or localhost dev ports
      if (
        !origin ||
        /^http:\/\/localhost:(5173|5174|5175|3000)$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:(5173|5174|5175|3000)$/.test(origin)
      ) {
        return callback(null, true);
      }
      callback(null, true); // Permissive for local development
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Naik Foods E-Commerce API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/pincode", pincodeRoutes);
app.use("/api/orders", orderRoutes);

// Catch 404 for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `[Express] Naik Foods Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});

module.exports = app;
