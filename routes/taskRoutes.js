const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// POST: Admin - Create a new task
router.post("/create", taskController.createTask);

// GET: User - Fetch tasks by platform
router.get("/fetch", taskController.getTasksByPlatform);

module.exports = router;
