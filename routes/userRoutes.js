// User routes: KYC, Profile
const express = require("express");
const router = express.Router();

// @route POST /api/user/kyc
// @desc Submit KYC form
router.post("/kyc", (req, res) => {
  res.send("KYC submitted");
});

module.exports = router;
