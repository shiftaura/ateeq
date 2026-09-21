const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

// 1. Initialize Express App
const app = express();

// 2. Connect to MongoDB Atlas / Local
connectDB();

// 3. Security & Utility Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Morgan request logging in development
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// 4. Request Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 5. Health Check Endpoint
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "MediConsult API is running",
  });
});

// 6. Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// 7. 404 Catch-All Middleware
app.use(notFound);

// 8. Centralized Error Handler Middleware
app.use(errorHandler);

// 9. Start HTTP Server
const PORT = env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` MediConsult Doctor Consultation & Guidance System  `);
  console.log(` Environment : ${env.NODE_ENV}                      `);
  console.log(` Server Port : ${PORT}                              `);
  console.log(` API Base    : http://localhost:${PORT}/api         `);
  console.log(` Health Check: http://localhost:${PORT}/api/health  `);
  console.log(` Client URL  : ${env.CLIENT_URL}                    `);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[Process] Unhandled Rejection: ${err.message}`, err);
  // Do not crash server in development, but log prominently
});

module.exports = { app, server };
