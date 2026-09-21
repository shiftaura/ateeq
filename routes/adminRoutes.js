const express = require("express");
const router = express.Router();
const {
  getUsers,
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAppointments,
  getDashboard,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes require authentication and role === 'admin'
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/doctors", getDoctors);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);
router.get("/appointments", getAppointments);

module.exports = router;
