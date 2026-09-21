const { body } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware");

const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),
  body("dateOfBirth")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Date of birth cannot be empty"),
  body("gender")
    .optional()
    .trim()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be 'male', 'female', or 'other'"),
  body("profileImage")
    .optional()
    .trim(),
  body("basicHealthInfo")
    .optional()
    .isObject()
    .withMessage("basicHealthInfo must be an object"),
  validate,
];

const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  validate,
];

module.exports = {
  validateUpdateProfile,
  validateChangePassword,
};
