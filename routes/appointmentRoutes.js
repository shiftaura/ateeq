const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getUserAppointments,
  getUpcomingAppointments,
  getPastAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  validateBookAppointment,
  validateRescheduleAppointment,
  validateUpdateStatus,
} = require("../validators/appointmentValidator");

router.use(protect);

// Doctor specific routes
router.get(
  "/doctor/appointments",
  authorize("doctor", "admin"),
  getDoctorAppointments
);

router.patch(
  "/doctor/appointments/:id/status",
  authorize("doctor", "admin"),
  validateUpdateStatus,
  updateDoctorAppointmentStatus
);

// Patient routes
router.post("/", validateBookAppointment, bookAppointment);
router.get("/", getUserAppointments);
router.get("/upcoming", getUpcomingAppointments);
router.get("/past", getPastAppointments);
router.get("/:id", getAppointmentById);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/reschedule", validateRescheduleAppointment, rescheduleAppointment);

module.exports = router;
