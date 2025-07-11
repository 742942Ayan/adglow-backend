// Admin routes: Approve KYC, tasks
const express = require("express");
const router = express.Router();

// @route POST /api/admin/task
// @desc Create a new task
router.post("/task", (req, res) => {
  res.send("Task created");
});

module.exports = router;
