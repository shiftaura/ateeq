const mongoose = require("mongoose");
const SymptomCheck = require("../models/SymptomCheck");
const MedicalHistory = require("../models/MedicalHistory");
const Notification = require("../models/Notification");
const aiService = require("./aiService");

const MAX_SYMPTOMS = 10;
const MAX_SYMPTOM_LENGTH = 100;

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Normalize symptoms into a clean array of short strings.
 * Limits size to reduce garbage input and prompt-injection surface.
 */
function normalizeSymptoms(symptoms) {
  const list = Array.isArray(symptoms) ? symptoms : [symptoms];
  const cleaned = list
    .filter((s) => typeof s === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_SYMPTOMS)
    .map((s) => s.slice(0, MAX_SYMPTOM_LENGTH));

  if (cleaned.length === 0) {
    throw httpError("At least one symptom is required", 400);
  }
  return cleaned;
}

/**
 * Symptom Service handles business logic for symptom checks,
 * orchestrating the AI service, database persistence, and medical history.
 */
class SymptomService {
  /**
   * Analyze symptoms, persist SymptomCheck and MedicalHistory records
   */
  static async processSymptomAnalysis({ userId, symptoms, duration, severity }) {
    const cleanSymptoms = normalizeSymptoms(symptoms);

    // Idempotency guard: Return recent identical analysis if submitted within 15 seconds
    const recentCheck = await SymptomCheck.findOne({
      user: userId,
      duration,
      severity,
      createdAt: { $gte: new Date(Date.now() - 15000) },
    }).sort({ createdAt: -1 });

    if (recentCheck) {
      const sameSymptoms =
        recentCheck.symptoms.length === cleanSymptoms.length &&
        cleanSymptoms.every((s) => recentCheck.symptoms.includes(s));
      if (sameSymptoms) {
        return recentCheck;
      }
    }

    // 1. Delegate to AI service for Gemini analysis & safety validation
    const aiResult = await aiService.analyzeSymptoms({
      symptoms: cleanSymptoms,
      duration,
      severity,
    });

    // Do not save failed analyses as if they were real assessments
    if (aiResult.isFallback) {
      throw httpError("Symptom analysis is temporarily unavailable. Please try again shortly.", 503);
    }

    // 2. Persist SymptomCheck document in MongoDB
    const symptomCheck = await SymptomCheck.create({
      user: userId,
      symptoms: cleanSymptoms,
      duration,
      severity,
      possibleCauses: aiResult.possibleCauses,
      urgencyLevel: aiResult.urgencyLevel,
      generalGuidance: aiResult.generalGuidance,
      doctorRecommendation: aiResult.doctorRecommendation,
      urgentWarning: aiResult.urgentWarning,
    });

    // 3. Create linked MedicalHistory record; roll back the check if this fails
    try {
      await MedicalHistory.create({
        user: userId,
        symptomCheck: symptomCheck._id,
        symptoms: cleanSymptoms,
        duration,
        severity,
        urgencyLevel: aiResult.urgencyLevel,
        generalGuidance: aiResult.generalGuidance,
        notes: "Auto-recorded from MediConsult symptom assessment.",
      });
    } catch (error) {
      await SymptomCheck.findByIdAndDelete(symptomCheck._id).catch((cleanupErr) =>
        console.error("[SymptomService] Cleanup failed:", cleanupErr.message)
      );
      throw error;
    }

    // 4. Best-effort in-app notification for high / urgent results
    if (aiResult.urgencyLevel === "urgent" || aiResult.urgencyLevel === "high") {
      try {
        await Notification.create({
          user: userId,
          type: "health",
          title: aiResult.urgencyLevel === "urgent" ? "Urgent Medical Alert" : "Medical Attention Recommended",
          message:
            aiResult.urgentWarning ||
            "Your reported symptoms indicate that prompt medical evaluation is recommended.",
        });
      } catch (error) {
        // Notification is non-critical; the assessment itself was saved successfully
        console.error("[SymptomService] Notification creation failed:", error.message);
      }
    }

    return symptomCheck;
  }

  /**
   * Retrieve user's past symptom checks with pagination
   */
  static async getUserSymptomHistory(userId, { page = 1, limit = 10 } = {}) {
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (safePage - 1) * safeLimit;

    const [records, total] = await Promise.all([
      SymptomCheck.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      SymptomCheck.countDocuments({ user: userId }),
    ]);

    return {
      records,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  /**
   * Get single symptom check by ID with user ownership check.
   * Returns null when the ID is invalid, missing, or belongs to another user
   * (so callers respond 404 and don't reveal that a record exists).
   */
  static async getSymptomCheckById(checkId, userId) {
    if (!mongoose.isValidObjectId(checkId)) {
      return null;
    }

    const check = await SymptomCheck.findById(checkId);
    if (!check || check.user.toString() !== userId.toString()) {
      return null;
    }
    return check;
  }
}

module.exports = SymptomService;