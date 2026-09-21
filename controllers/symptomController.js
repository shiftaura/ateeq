const symptomService = require("../services/symptomService");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Analyze symptoms using Gemini AI service
 * @route   POST /api/symptoms/analyze
 * @access  Private
 */
const analyzeSymptoms = asyncHandler(async (req, res) => {
  const { symptoms, duration, severity } = req.body;
  const userId = req.user._id;

  const result = await symptomService.processSymptomAnalysis({
    userId,
    symptoms,
    duration,
    severity,
  });

  return ApiResponse.success(res, 201, "Symptom analysis completed successfully", result);
});

/**
 * @desc    Get user's past symptom analysis history
 * @route   GET /api/symptoms/history
 * @access  Private
 */
const getSymptomHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const data = await symptomService.getUserSymptomHistory(userId, { page, limit });

  return ApiResponse.success(res, 200, "Symptom history retrieved", data);
});

/**
 * @desc    Get details of a specific symptom check
 * @route   GET /api/symptoms/:id
 * @access  Private
 */
const getSymptomCheckById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const check = await symptomService.getSymptomCheckById(id, userId);
  if (!check) {
    return ApiResponse.error(res, 404, "Symptom check record not found");
  }

  return ApiResponse.success(res, 200, "Symptom check retrieved", check);
});

module.exports = {
  analyzeSymptoms,
  getSymptomHistory,
  getSymptomCheckById,
};
