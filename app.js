const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");

const { sanitize } = require("./utils/sanitize");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const recipeRouter = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// GLOBAL MIDDLEWARES
// Security HTTP headers
app.use(helmet());

// Dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }

  req.cleanQuery = sanitize(req.query);

  next();
});

// Prevent parameter pollution
app.use(hpp());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/users", userRouter);

// Handle all undefined routes (404 Not Found)
app.use((req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
