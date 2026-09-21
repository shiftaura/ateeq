const { body } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware");

const validateBookAppointment = [
  body("doctorId")
    .trim()
    .notEmpty()
    .withMessage("Doctor ID is required")
    .isMongoId()
    .withMessage("Doctor ID must be a valid MongoDB ObjectId"),
  body("date")
    .trim()
    .notEmpty()
    .withMessage("Appointment date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .trim()
    .notEmpty()
    .withMessage("Appointment time slot is required (e.g., '10:30 AM')"),
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason for consultation is required")
    .isLength({ min: 3, max: 500 })
    .withMessage("Reason must be between 3 and 500 characters"),
  validate,
];

const validateRescheduleAppointment = [
  body("date")
    .trim()
    .notEmpty()
    .withMessage("New date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .trim()
    .notEmpty()
    .withMessage("New time slot is required"),
  validate,
];

const validateUpdateStatus = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage("Status must be one of: 'pending', 'confirmed', 'completed', 'cancelled'"),
  validate,
];

module.exports = {
  validateBookAppointment,
  validateRescheduleAppointment,
  validateUpdateStatus,
};
