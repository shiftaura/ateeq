const appointmentService = require("../services/appointmentService");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Book a new doctor appointment
 * @route   POST /api/appointments
 * @access  Private
 */
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  const patientId = req.user._id;

  const appointment = await appointmentService.bookAppointment({
    patientId,
    doctorId,
    date,
    time,
    reason,
  });

  return ApiResponse.success(res, 201, "Appointment booked successfully", appointment);
});

/**
 * @desc    Get user's appointments (all)
 * @route   GET /api/appointments
 * @access  Private
 */
const getUserAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await appointmentService.getUserAppointments(userId, {
    type: "all",
    page,
    limit,
  });

  return ApiResponse.success(res, 200, "Appointments retrieved", result);
});

/**
 * @desc    Get user's upcoming appointments
 * @route   GET /api/appointments/upcoming
 * @access  Private
 */
const getUpcomingAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await appointmentService.getUserAppointments(userId, {
    type: "upcoming",
    page,
    limit,
  });

  return ApiResponse.success(res, 200, "Upcoming appointments retrieved", result);
});

/**
 * @desc    Get user's past or completed appointments
 * @route   GET /api/appointments/past
 * @access  Private
 */
const getPastAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await appointmentService.getUserAppointments(userId, {
    type: "past",
    page,
    limit,
  });

  return ApiResponse.success(res, 200, "Past appointments retrieved", result);
});

/**
 * @desc    Get appointment details by ID
 * @route   GET /api/appointments/:id
 * @access  Private
 */
const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentService.getAppointmentById(
    id,
    req.user._id,
    req.user.role
  );

  return ApiResponse.success(res, 200, "Appointment retrieved", appointment);
});

/**
 * @desc    Cancel an appointment
 * @route   PATCH /api/appointments/:id/cancel
 * @access  Private
 */
const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentService.cancelAppointment(
    id,
    req.user._id,
    req.user.role
  );

  return ApiResponse.success(res, 200, "Appointment cancelled successfully", appointment);
});

/**
 * @desc    Reschedule an appointment to a new date and time
 * @route   PATCH /api/appointments/:id/reschedule
 * @access  Private
 */
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  const appointment = await appointmentService.rescheduleAppointment(
    id,
    req.user._id,
    { date, time }
  );

  return ApiResponse.success(res, 200, "Appointment rescheduled successfully", appointment);
});

/**
 * @desc    Get all appointments assigned to the logged in doctor
 * @route   GET /api/doctor/appointments
 * @access  Private (Doctor / Admin)
 */
const getDoctorAppointments = asyncHandler(async (req, res) => {
  // Pass doctor user email or ID to match doctor record
  const appointments = await appointmentService.getDoctorAppointments(req.user.email);
  return ApiResponse.success(res, 200, "Doctor appointments retrieved", appointments);
});

/**
 * @desc    Update appointment status (e.g., completed, confirmed, cancelled)
 * @route   PATCH /api/doctor/appointments/:id/status
 * @access  Private (Doctor / Admin)
 */
const updateDoctorAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await appointmentService.updateAppointmentStatus(id, status);
  return ApiResponse.success(res, 200, `Appointment status updated to ${status}`, appointment);
});

module.exports = {
  bookAppointment,
  getUserAppointments,
  getUpcomingAppointments,
  getPastAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
};
