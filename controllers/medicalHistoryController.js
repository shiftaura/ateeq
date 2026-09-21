const MedicalHistory = require("../models/MedicalHistory");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get user's complete medical history records
 * @route   GET /api/medical-history
 * @access  Private
 */
const getMedicalHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    MedicalHistory.find({ user: userId })
      .populate("doctor", "name specialization clinic")
      .populate("appointment", "date time status reason")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    MedicalHistory.countDocuments({ user: userId }),
  ]);

  return ApiResponse.success(res, 200, "Medical history retrieved", {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

/**
 * @desc    Get single medical history entry by ID
 * @route   GET /api/medical-history/:id
 * @access  Private
 */
const getMedicalHistoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await MedicalHistory.findById(id)
    .populate("doctor", "name specialization clinic phone")
    .populate("appointment", "date time status reason");

  if (!record) {
    return ApiResponse.error(res, 404, "Medical history entry not found");
  }

  // Strictly enforce user privacy: only the owner or admin can view
  if (record.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return ApiResponse.error(res, 403, "Not authorized to access this medical record");
  }

  return ApiResponse.success(res, 200, "Medical history entry retrieved", record);
});

/**
 * @desc    Delete a medical history entry
 * @route   DELETE /api/medical-history/:id
 * @access  Private
 */
const deleteMedicalHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const record = await MedicalHistory.findById(id);

  if (!record) {
    return ApiResponse.error(res, 404, "Medical history entry not found");
  }

  // Strictly enforce user privacy: only the owner can delete
  if (record.user.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 403, "Not authorized to delete this medical record");
  }

  await MedicalHistory.findByIdAndDelete(id);

  return ApiResponse.success(res, 200, "Medical history entry deleted successfully", {});
});

module.exports = {
  getMedicalHistory,
  getMedicalHistoryById,
  deleteMedicalHistory,
};
