// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register user and send OTP
router.post("/register", registerUser);

module.exports = router;
