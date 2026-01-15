const express = require("express");
const cors = require("cors");

const connectDB = require("../Models/db");
const AuthRouter = require("../Routes/AuthRouter");
const MovieSeriesRouter = require("../Routes/MovieSeriesRouter");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: process.env.BASE_URL }));

// ✅ DB connection middleware (VERY IMPORTANT)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Routes
app.use("/auth", AuthRouter);
app.use("/api", MovieSeriesRouter);

module.exports = app;
