const AppError = require("../utils/AppError.js");

const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (error) => {
  const value = Object.values(error.keyValue)[0];
  const message = `Duplicate field value: '${value}'. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidtionError = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, _next) => {
  const nodeEnv = req.get("NODE_ENV") || process.env.NODE_ENV || "development";

  if (nodeEnv === "development") {
    sendErrorDev(err, res);
  } else if (nodeEnv === "production") {
    let error = err;
    error.msesage = err.message;

    // Handle specific error types
    if (err.cause?.code === 11000) {
      error = handleDuplicateFields(error.cause);
    }
    if (err.name === "CastError" || error.kind === "ObjectId") {
      error = handleCastError(error);
    }
    if (err.name === "ValidationError") {
      error = handleValidtionError(error);
    }
    if (
      err.name === "TypeError" &&
      err.message.includes("circular structure")
    ) {
      error = new AppError("Invalid data/query format", 400);
    }
    sendErrorProd(error, res);
  }
};
