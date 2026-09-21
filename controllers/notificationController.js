const notificationService = require("../services/notificationService");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get current user's notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const result = await notificationService.getUserNotifications(userId, { page, limit });

  return ApiResponse.success(res, 200, "Notifications retrieved", result);
});

/**
 * @desc    Mark specific notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await notificationService.markAsRead(id, req.user._id);

  return ApiResponse.success(res, 200, "Notification marked as read", notification);
});

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);

  return ApiResponse.success(res, 200, "All notifications marked as read", result);
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await notificationService.deleteNotification(id, req.user._id);

  return ApiResponse.success(res, 200, "Notification deleted", {});
});

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
