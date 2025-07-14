// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, verifyOtp } = require("../controllers/authController");

// ✅ Register route
router.post("/register", register);

// ✅ Correct OTP verification route
router.post("/verify-otp", verifyOtp);

module.exports = router;
