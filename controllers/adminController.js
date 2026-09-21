const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const SymptomCheck = require("../models/SymptomCheck");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return ApiResponse.success(res, 200, "Users list retrieved", {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

/**
 * @desc    Get all doctors for admin management
 * @route   GET /api/admin/doctors
 * @access  Private (Admin)
 */
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, "Doctors list retrieved", doctors);
});

/**
 * @desc    Create/Add a new doctor
 * @route   POST /api/admin/doctors
 * @access  Private (Admin)
 */
const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    specialization,
    qualification,
    experience,
    about,
    profileImage,
    clinic,
    phone,
    isAvailable,
    availability,
  } = req.body;

  const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
  if (existingDoctor) {
    return ApiResponse.error(res, 409, "A doctor with this email already exists");
  }

  const doctor = await Doctor.create({
    name,
    email: email.toLowerCase(),
    specialization,
    qualification,
    experience,
    about,
    profileImage: profileImage || "",
    clinic: clinic || { name: "MediConsult Clinic" },
    phone: phone || "",
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    availability: availability || [],
  });

  return ApiResponse.success(res, 201, "Doctor created successfully", doctor);
});

/**
 * @desc    Update doctor profile
 * @route   PUT /api/admin/doctors/:id
 * @access  Private (Admin)
 */
const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return ApiResponse.error(res, 404, "Doctor not found");
  }

  return ApiResponse.success(res, 200, "Doctor updated successfully", doctor);
});

/**
 * @desc    Delete doctor
 * @route   DELETE /api/admin/doctors/:id
 * @access  Private (Admin)
 */
const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndDelete(id);

  if (!doctor) {
    return ApiResponse.error(res, 404, "Doctor not found");
  }

  return ApiResponse.success(res, 200, "Doctor removed successfully", {});
});

/**
 * @desc    Get all appointments across system
 * @route   GET /api/admin/appointments
 * @access  Private (Admin)
 */
const getAppointments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [appointments, total] = await Promise.all([
    Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization clinic")
      .sort({ date: -1, time: 1 })
      .skip(skip)
      .limit(limit),
    Appointment.countDocuments(),
  ]);

  return ApiResponse.success(res, 200, "Appointments list retrieved", {
    appointments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

/**
 * @desc    Admin dashboard metrics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalDoctors,
    totalAppointments,
    pendingAppointments,
    completedAppointments,
    totalSymptomChecks,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Doctor.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "pending" }),
    Appointment.countDocuments({ status: "completed" }),
    SymptomCheck.countDocuments(),
  ]);

  return ApiResponse.success(res, 200, "Admin metrics retrieved", {
    totalUsers,
    totalDoctors,
    totalAppointments,
    pendingAppointments,
    completedAppointments,
    totalSymptomChecks,
  });
});

module.exports = {
  getUsers,
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAppointments,
  getDashboard,
};
