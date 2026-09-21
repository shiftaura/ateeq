const express = require("express");
const router = express.Router();
const {
  getMedicalHistory,
  getMedicalHistoryById,
  deleteMedicalHistory,
} = require("../controllers/medicalHistoryController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getMedicalHistory);
router.get("/:id", getMedicalHistoryById);
router.delete("/:id", deleteMedicalHistory);

module.exports = router;
