const Doctor = require("../models/Doctor");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all doctors with filtering, search, and pagination
 * @route   GET /api/doctors
 * @access  Public
 */
const getDoctors = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search ? req.query.search.trim() : "";
  const specialization = req.query.specialization ? req.query.specialization.trim() : "";
  const available = req.query.available;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
      { qualification: { $regex: search, $options: "i" } },
    ];
  }

  if (specialization) {
    query.specialization = { $regex: `^${specialization}$`, $options: "i" };
  }

  if (available !== undefined && available !== "") {
    query.isAvailable = available === "true" || available === true;
  }

  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .sort({ experience: -1, name: 1 })
      .skip(skip)
      .limit(limit),
    Doctor.countDocuments(query),
  ]);

  return ApiResponse.success(res, 200, "Doctors list retrieved", {
    doctors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

/**
 * @desc    Get doctor details by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return ApiResponse.error(res, 404, "Doctor not found");
  }

  return ApiResponse.success(res, 200, "Doctor profile retrieved", doctor);
});

/**
 * @desc    Get complete doctor availability calendar
 * @route   GET /api/doctors/:id/availability
 * @access  Public
 */
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select("name specialization isAvailable availability");

  if (!doctor) {
    return ApiResponse.error(res, 404, "Doctor not found");
  }

  return ApiResponse.success(res, 200, "Doctor availability retrieved", {
    doctorId: doctor._id,
    doctorName: doctor.name,
    specialization: doctor.specialization,
    isAvailable: doctor.isAvailable,
    availability: doctor.availability,
  });
});

/**
 * @desc    Get available slots for a specific date
 * @route   GET /api/doctors/:id/slots?date=2026-09-25
 * @access  Public
 */
const getDoctorSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return ApiResponse.error(res, 400, "Date query parameter is required (e.g., ?date=YYYY-MM-DD)");
  }

  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return ApiResponse.error(res, 404, "Doctor not found");
  }

  const daySchedule = doctor.availability.find((d) => d.date === date);

  const slots = daySchedule ? daySchedule.slots : [];
  const openSlots = slots.filter((slot) => !slot.isBooked);

  return ApiResponse.success(res, 200, `Slots for ${date} retrieved`, {
    doctorId: doctor._id,
    doctorName: doctor.name,
    date,
    allSlots: slots,
    availableSlots: openSlots,
    hasAvailableSlots: openSlots.length > 0,
  });
});

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorAvailability,
  getDoctorSlots,
};
