const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const adminAuth = require("../middleware/adminAuth");

// ✅ Admin creates a new task
router.post("/create", adminAuth, taskController.createTask);

// ✅ User fetches tasks by platform
router.get("/fetch", taskController.getTasksByPlatform);

module.exports = router;
