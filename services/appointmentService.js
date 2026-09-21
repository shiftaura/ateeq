const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Notification = require("../models/Notification");
const MedicalHistory = require("../models/MedicalHistory");

class AppointmentService {
  /**
   * Books a doctor appointment with concurrency & double-booking protection
   */
  static async bookAppointment({ patientId, doctorId, date, time, reason }) {
    // 1. Verify doctor existence and general availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    if (!doctor.isAvailable) {
      const error = new Error("This doctor is currently not accepting appointments");
      error.statusCode = 400;
      throw error;
    }

    // 2. Check if active appointment already exists in Appointment collection
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      const error = new Error("This appointment slot is already booked");
      error.statusCode = 409;
      throw error;
    }

    // 3. Verify availability array inside doctor profile if available
    const daySchedule = doctor.availability.find((d) => d.date === date);
    if (daySchedule) {
      const slot = daySchedule.slots.find((s) => s.time.toLowerCase() === time.toLowerCase());
      if (slot && slot.isBooked) {
        const error = new Error("This appointment slot is already booked");
        error.statusCode = 409;
        throw error;
      }
    }

    // 4. Create appointment
    let appointment;
    try {
      appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        date,
        time,
        reason,
        status: "confirmed",
      });
    } catch (dbError) {
      // Handle MongoDB unique compound index race condition
      if (dbError.code === 11000) {
        const error = new Error("This appointment slot is already booked");
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }

    // 5. Update slot in doctor's availability
    await Doctor.updateOne(
      {
        _id: doctorId,
        "availability.date": date,
        "availability.slots.time": time,
      },
      {
        $set: {
          "availability.$[day].slots.$[slot].isBooked": true,
        },
      },
      {
        arrayFilters: [{ "day.date": date }, { "slot.time": time }],
      }
    );

    // 6. Link to user's medical history
    await MedicalHistory.create({
      user: patientId,
      doctor: doctorId,
      appointment: appointment._id,
      notes: `Consultation booked with Dr. ${doctor.name} on ${date} at ${time} for: ${reason}`,
    });

    // 7. Create in-app notification
    await Notification.create({
      user: patientId,
      type: "appointment",
      title: "Appointment Confirmed",
      message: `Your appointment with Dr. ${doctor.name} (${doctor.specialization}) on ${date} at ${time} has been confirmed.`,
      appointment: appointment._id,
    });

    // Populate and return appointment
    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialization qualification clinic phone profileImage")
      .populate("patient", "name email phone");

    return populated;
  }

  /**
   * Get user's appointments (filter: upcoming, past, all)
   */
  static async getUserAppointments(userId, { type = "all", page = 1, limit = 10 } = {}) {
    const todayStr = new Date().toISOString().split("T")[0];
    const query = { patient: userId };

    if (type === "upcoming") {
      query.status = { $in: ["pending", "confirmed"] };
      query.date = { $gte: todayStr };
    } else if (type === "past") {
      query.$or = [
        { status: { $in: ["completed", "cancelled"] } },
        { date: { $lt: todayStr } },
      ];
    }

    const skip = (page - 1) * limit;
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("doctor", "name specialization qualification clinic profileImage phone")
        .sort({ date: type === "upcoming" ? 1 : -1, time: 1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(query),
    ]);

    return {
      appointments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single appointment by ID
   */
  static async getAppointmentById(appointmentId, userId, userRole = "user") {
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor", "name specialization qualification clinic phone profileImage")
      .populate("patient", "name email phone");

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    // Verify authorization
    const isPatient = appointment.patient._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";
    // If user is a doctor, verify matching doctor email or ID if linked
    if (!isPatient && !isAdmin && userRole !== "doctor") {
      const error = new Error("Not authorized to view this appointment");
      error.statusCode = 403;
      throw error;
    }

    return appointment;
  }

  /**
   * Cancel an appointment and free the doctor slot
   */
  static async cancelAppointment(appointmentId, userId, userRole = "user") {
    const appointment = await Appointment.findById(appointmentId).populate("doctor", "name");

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    if (appointment.patient.toString() !== userId.toString() && userRole !== "admin") {
      const error = new Error("Not authorized to cancel this appointment");
      error.statusCode = 403;
      throw error;
    }

    if (appointment.status === "cancelled") {
      const error = new Error("Appointment is already cancelled");
      error.statusCode = 400;
      throw error;
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Release slot in Doctor availability
    await Doctor.updateOne(
      {
        _id: appointment.doctor._id,
        "availability.date": appointment.date,
        "availability.slots.time": appointment.time,
      },
      {
        $set: {
          "availability.$[day].slots.$[slot].isBooked": false,
        },
      },
      {
        arrayFilters: [{ "day.date": appointment.date }, { "slot.time": appointment.time }],
      }
    );

    // Create notification
    await Notification.create({
      user: appointment.patient,
      type: "appointment",
      title: "Appointment Cancelled",
      message: `Your appointment with Dr. ${appointment.doctor.name} on ${appointment.date} at ${appointment.time} has been cancelled.`,
      appointment: appointment._id,
    });

    return appointment;
  }

  /**
   * Reschedule an appointment
   */
  static async rescheduleAppointment(appointmentId, userId, { date, time }) {
    const appointment = await Appointment.findById(appointmentId).populate("doctor", "name");

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    if (appointment.patient.toString() !== userId.toString()) {
      const error = new Error("Not authorized to reschedule this appointment");
      error.statusCode = 403;
      throw error;
    }

    if (appointment.status === "cancelled") {
      const error = new Error("Cannot reschedule a cancelled appointment. Please book a new one.");
      error.statusCode = 400;
      throw error;
    }

    // Check if new slot is already booked
    const slotConflict = await Appointment.findOne({
      doctor: appointment.doctor._id,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (slotConflict) {
      const error = new Error("The requested new slot is already booked");
      error.statusCode = 409;
      throw error;
    }

    const oldDate = appointment.date;
    const oldTime = appointment.time;

    // Free the old slot
    await Doctor.updateOne(
      {
        _id: appointment.doctor._id,
        "availability.date": oldDate,
        "availability.slots.time": oldTime,
      },
      {
        $set: {
          "availability.$[day].slots.$[slot].isBooked": false,
        },
      },
      {
        arrayFilters: [{ "day.date": oldDate }, { "slot.time": oldTime }],
      }
    );

    // Book the new slot
    await Doctor.updateOne(
      {
        _id: appointment.doctor._id,
        "availability.date": date,
        "availability.slots.time": time,
      },
      {
        $set: {
          "availability.$[day].slots.$[slot].isBooked": true,
        },
      },
      {
        arrayFilters: [{ "day.date": date }, { "slot.time": time }],
      }
    );

    // Update appointment document
    appointment.date = date;
    appointment.time = time;
    appointment.status = "confirmed";
    await appointment.save();

    // Create notification
    await Notification.create({
      user: appointment.patient,
      type: "appointment",
      title: "Appointment Rescheduled",
      message: `Your appointment with Dr. ${appointment.doctor.name} has been rescheduled to ${date} at ${time}.`,
      appointment: appointment._id,
    });

    return appointment;
  }

  /**
   * Get appointments assigned to a doctor
   */
  static async getDoctorAppointments(doctorEmailOrId) {
    let doctor = await Doctor.findById(doctorEmailOrId);
    if (!doctor) {
      doctor = await Doctor.findOne({ email: doctorEmailOrId });
    }

    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      throw error;
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone dateOfBirth gender")
      .sort({ date: 1, time: 1 });

    return appointments;
  }

  /**
   * Update appointment status (Doctor/Admin)
   */
  static async updateAppointmentStatus(appointmentId, newStatus) {
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor", "name")
      .populate("patient", "name");

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    appointment.status = newStatus;
    await appointment.save();

    // If cancelled, free up slot
    if (newStatus === "cancelled") {
      await Doctor.updateOne(
        {
          _id: appointment.doctor._id,
          "availability.date": appointment.date,
          "availability.slots.time": appointment.time,
        },
        {
          $set: {
            "availability.$[day].slots.$[slot].isBooked": false,
          },
        },
        {
          arrayFilters: [{ "day.date": appointment.date }, { "slot.time": appointment.time }],
        }
      );
    }

    // Notify patient
    await Notification.create({
      user: appointment.patient._id,
      type: "appointment",
      title: `Appointment ${newStatus.toUpperCase()}`,
      message: `Your appointment with Dr. ${appointment.doctor.name} has been updated to: ${newStatus}.`,
      appointment: appointment._id,
    });

    return appointment;
  }
}

module.exports = AppointmentService;
