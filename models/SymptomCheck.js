const mongoose = require("mongoose");

const symptomCheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    symptoms: {
      type: [String],
      required: [true, "Symptoms list is required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one symptom must be provided",
      },
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: {
        values: ["mild", "moderate", "severe"],
        message: "Severity must be mild, moderate, or severe",
      },
    },
    possibleCauses: {
      type: [String],
      default: [],
    },
    urgencyLevel: {
      type: String,
      required: [true, "Urgency level is required"],
      enum: {
        values: ["low", "moderate", "high", "urgent"],
        message: "Urgency level must be low, moderate, high, or urgent",
      },
      default: "moderate",
    },
    generalGuidance: {
      type: [String],
      default: [],
    },
    doctorRecommendation: {
      type: Boolean,
      default: true,
    },
    urgentWarning: {
      type: String,
      default: null,
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

const SymptomCheck = mongoose.model("SymptomCheck", symptomCheckSchema);

module.exports = SymptomCheck;
