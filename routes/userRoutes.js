const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateUpdateProfile,
  validateChangePassword,
} = require("../validators/userValidator");

router.use(protect); // All user routes require authentication

router.get("/profile", getProfile);
router.put("/profile", validateUpdateProfile, updateProfile);
router.put("/change-password", validateChangePassword, changePassword);
router.get("/dashboard", getDashboard);

module.exports = router;
