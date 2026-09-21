const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

/**
 * Protect middleware: validates Bearer token and attaches user to req
 */
const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return ApiResponse.error(res, 401, "Not authorized to access this route, token missing");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(res, 401, "The user belonging to this token no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, 401, "Token has expired, please log in again");
    }
    return ApiResponse.error(res, 401, "Invalid authentication token");
  }
};

module.exports = { protect };
