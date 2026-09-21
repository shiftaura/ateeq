const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, "Appointment date is required"],
      trim: true,
    },
    time: {
      type: String, // e.g. "10:30 AM"
      required: [true, "Appointment time is required"],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, "Reason for consultation is required"],
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "completed", "cancelled"],
        message: "Status must be pending, confirmed, completed, or cancelled",
      },
      default: "confirmed",
      index: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent double bookings at database level using partial filter expression:
// Only one non-cancelled appointment per doctor, date, and time slot.
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } },
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
