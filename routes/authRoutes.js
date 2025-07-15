const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  updatePassword // ✅ Include this here
} = require("../controllers/authController");

// ✅ Register route
router.post("/register", register);

// ✅ Verify OTP route
router.post("/verify-otp", verifyOtp);

// ✅ Login route
router.post("/login", login);

// ✅ Forgot Password
router.post("/forgot-password", forgotPassword);

// ✅ Update Password
router.post("/update-password", updatePassword);

module.exports = router;
