// Task routes: View & Complete tasks
const express = require("express");
const router = express.Router();

// @route GET /api/task/
// @desc Get all available tasks
router.get("/", (req, res) => {
  res.send("All tasks");
});

module.exports = router;
