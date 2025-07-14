const express = require("express");
const router = express.Router();
const { register, verifyOtp, login } = require("../controllers/authController");

// Register route
router.post("/register", register);

// Verify OTP route
router.post("/verify-otp", verifyOtp);

// ✅ Login route
router.post("/login", login);

module.exports = router;
