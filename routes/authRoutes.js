// Auth routes: Register, Login, OTP
const express = require("express");
const router = express.Router();

// @route POST /api/auth/register
// @desc Register user with OTP
router.post("/register", (req, res) => {
  res.send("User registered");
});

module.exports = router;
