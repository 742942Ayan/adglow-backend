const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const adminAuth = require("../middleware/adminAuth");

// ✅ Admin creates a new task
router.post("/create", adminAuth, taskController.createTask);

// ✅ User fetches tasks by platform (e.g., ?platform=youtube)
router.get("/fetch", taskController.getTasksByPlatform);

// ✅ User submits task completion
router.post("/submit", taskController.submitTask);

// ✅ Admin deletes a task
router.delete("/delete/:taskId", adminAuth, taskController.deleteTask);

module.exports = router;
