const { body } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware");

const validateAnalyzeSymptoms = [
  body("symptoms")
    .isArray({ min: 1 })
    .withMessage("Symptoms must be a non-empty array")
    .custom((arr) => {
      if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error("Symptoms array cannot be empty");
      }
      if (arr.length > 20) {
        throw new Error("Maximum of 20 symptoms allowed per check");
      }
      const invalid = arr.some((s) => typeof s !== "string" || s.trim().length === 0);
      if (invalid) {
        throw new Error("Each symptom must be a non-empty text string");
      }
      return true;
    }),
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration is required (e.g., '1-3 days', '2 weeks')")
    .isLength({ max: 50 })
    .withMessage("Duration must not exceed 50 characters"),
  body("severity")
    .trim()
    .notEmpty()
    .withMessage("Severity is required")
    .isIn(["mild", "moderate", "severe"])
    .withMessage("Severity must be one of: 'mild', 'moderate', 'severe'"),
  validate,
];

module.exports = {
  validateAnalyzeSymptoms,
};
