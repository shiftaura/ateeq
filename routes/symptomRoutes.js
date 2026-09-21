const express = require("express");
const router = express.Router();
const {
  analyzeSymptoms,
  getSymptomHistory,
  getSymptomCheckById,
} = require("../controllers/symptomController");
const { protect } = require("../middleware/authMiddleware");
const { validateAnalyzeSymptoms } = require("../validators/symptomValidator");

router.use(protect); // Symptom routes require authentication

router.post("/analyze", validateAnalyzeSymptoms, analyzeSymptoms);
router.get("/history", getSymptomHistory);
router.get("/:id", getSymptomCheckById);

module.exports = router;
