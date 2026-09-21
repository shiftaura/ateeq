const User = require("../models/User");
const Appointment = require("../models/Appointment");
const SymptomCheck = require("../models/SymptomCheck");
const MedicalHistory = require("../models/MedicalHistory");
const Notification = require("../models/Notification");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, 200, "User profile retrieved", {
    user: user.toJSON(),
  });
});

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, dateOfBirth, gender, profileImage, basicHealthInfo } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (gender) user.gender = gender;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (basicHealthInfo && typeof basicHealthInfo === "object") {
    user.basicHealthInfo = {
      ...user.basicHealthInfo.toObject(),
      ...basicHealthInfo,
    };
  }

  await user.save();

  return ApiResponse.success(res, 200, "Profile updated successfully", {
    user: user.toJSON(),
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return ApiResponse.error(res, 400, "Incorrect current password");
  }

  user.password = newPassword;
  await user.save();

  return ApiResponse.success(res, 200, "Password changed successfully", {});
});

/**
 * @desc    Get consolidated user dashboard overview
 * @route   GET /api/users/dashboard
 * @access  Private
 */
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const todayStr = new Date().toISOString().split("T")[0];

  const [
    user,
    upcomingAppointment,
    recentSymptomChecks,
    recentMedicalHistory,
    unreadNotifications,
  ] = await Promise.all([
    User.findById(userId),
    Appointment.findOne({
      patient: userId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: todayStr },
    })
      .populate("doctor", "name specialization qualification clinic phone profileImage")
      .sort({ date: 1, time: 1 }),
    SymptomCheck.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3),
    MedicalHistory.find({ user: userId })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .limit(3),
    Notification.find({ user: userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return ApiResponse.success(res, 200, "Dashboard data loaded successfully", {
    user: user.toJSON(),
    upcomingAppointment,
    recentSymptomChecks,
    recentMedicalHistory,
    unreadNotifications,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
};
