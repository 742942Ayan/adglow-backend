// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser, verifyOtp } = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register user and send OTP
router.post("/register", registerUser);

// @route   POST /api/auth/verify
// @desc    Verify OTP
router.post("/verify", verifyOtp);

module.exports = router;
