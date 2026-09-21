const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: [true, "Slot time is required"],
      trim: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const dailyAvailabilitySchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, "Availability date is required"],
      trim: true,
    },
    slots: [slotSchema],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Doctor email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      index: true,
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
    },
    experience: {
      type: Number, // Years of experience
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    about: {
      type: String,
      required: [true, "About description is required"],
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    clinic: {
      name: { type: String, default: "MediConsult Partner Clinic" },
      address: { type: String, default: "Medical Center Drive, Suite 100" },
      city: { type: String, default: "Metropolis" },
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    availability: [dailyAvailabilitySchema],
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

// Indexes for fast searching and filtering
doctorSchema.index({ name: "text", specialization: "text" });

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
