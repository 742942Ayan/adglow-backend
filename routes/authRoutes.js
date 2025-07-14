// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, verifyOtp } = require("../controllers/authController");

// ✅ Route to register user and send OTP
router.post("/register", register);

// ✅ Route to verify OTP (corrected path)
router.post("/verify-otp", verifyOtp);

module.exports = router;
