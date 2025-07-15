const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

// ✅ GET user profile (secured)
router.get("/profile", authMiddleware, getUserProfile);

// ✅ POST KYC submission (dummy for now)
router.post("/kyc", (req, res) => {
  res.send("KYC submitted");
});

module.exports = router;
