// Leaderboard routes
const express = require("express");
const router = express.Router();

// @route GET /api/leaderboard
// @desc Get top earners
router.get("/", (req, res) => {
  res.send("Leaderboard");
});

module.exports = router;
