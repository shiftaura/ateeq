const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, dateOfBirth, gender } = req.body;

  // Check if user email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return ApiResponse.error(res, 409, "An account with this email already exists");
  }

  // Create new user (default role: 'user')
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone: phone || "",
    dateOfBirth,
    gender,
    role: "user",
  });

  const token = generateToken(user._id, user.role);

  return ApiResponse.success(res, 201, "User registered successfully", {
    user: user.toJSON(),
    token,
  });
});

/**
 * @desc    Authenticate user & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Query user with password explicitly included for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return ApiResponse.error(res, 401, "Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 401, "Invalid email or password");
  }

  const token = generateToken(user._id, user.role);

  return ApiResponse.success(res, 200, "Login successful", {
    user: user.toJSON(),
    token,
  });
});

/**
 * @desc    Logout user (clears cookies if set)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return ApiResponse.success(res, 200, "Logged out successfully", {});
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private (protect)
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, 200, "Current user retrieved", {
    user: user.toJSON(),
  });
});

/**
 * @desc    Generate forgot-password token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Return friendly generic response to prevent email enumeration
    return ApiResponse.success(
      res,
      200,
      "If an account with that email exists, reset instructions have been generated",
      {}
    );
  }

  // Generate reset token (in real production, send via email; here return token for API flow)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  return ApiResponse.success(res, 200, "Password reset token generated", {
    resetToken,
    expiresIn: "30 minutes",
  });
});

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return ApiResponse.error(res, 400, "Invalid or expired password reset token");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const newToken = generateToken(user._id, user.role);

  return ApiResponse.success(res, 200, "Password has been successfully reset", {
    token: newToken,
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
