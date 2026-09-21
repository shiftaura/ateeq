const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    symptomCheck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SymptomCheck",
      default: null,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: "",
    },
    severity: {
      type: String,
      default: "",
    },
    urgencyLevel: {
      type: String,
      default: "moderate",
    },
    generalGuidance: {
      type: [String],
      default: [],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
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

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);

module.exports = MedicalHistory;
