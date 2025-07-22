const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   GET /api/leaderboard
// @desc    Get top 10 earners based on wallet balance
// @access  Public
router.get("/", async (req, res) => {
  try {
    const topUsers = await User.find({})  // You can add filters like { isActive: true } if needed
      .sort({ walletBalance: -1 })        // Sort by highest wallet balance
      .limit(10)                          // Only top 10
      .select("fullName email walletBalance referralEarnings"); // Only necessary fields

    res.status(200).json(topUsers);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
