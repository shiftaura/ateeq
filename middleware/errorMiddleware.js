const ApiResponse = require("../utils/apiResponse");

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Mongoose bad ObjectId (CastError)
  if (err.name === "CastError") {
    message = `Invalid format for resource ID: '${err.value}'`;
    statusCode = 400;
    errors = [{ field: err.path, message: `Invalid identifier format: ${err.value}` }];
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    const field = fields[0] || "field";
    const val = err.keyValue ? err.keyValue[field] : "";
    message = `Duplicate value '${val}' entered for unique field '${field}'`;
    statusCode = 409;
    errors = [{ field, message: `${field} already exists with value '${val}'` }];
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = "Validation error";
    statusCode = 400;
    errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // JWT invalid error
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token provided";
    statusCode = 401;
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    message = "Token has expired";
    statusCode = 401;
  }

  // Log error internally in non-test environments
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${statusCode} - ${message}:`, err.stack || err);
  }

  return ApiResponse.error(res, statusCode, message, errors);
};

module.exports = errorHandler;
