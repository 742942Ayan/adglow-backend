// routes/leaderboard.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ✅ Corrected
const authMiddleware = require("../middleware/authMiddleware"); // Token verify

// @route GET /api/leaderboard
// @desc Get top 10 users by earnings
// @access Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ totalEarnings: -1 }) // Highest earning first
      .limit(10) // Top 10
      .select("fullName email country state wallet totalEarnings"); // Only needed fields

    res.json(topUsers);
  } catch (err) {
    console.error("Leaderboard fetch error:", err.message);
    res.status(500).json({ message: "Server error while loading leaderboard" });
  }
});

module.exports = router;
