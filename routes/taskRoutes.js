const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const taskController = require("../controllers/taskController");

// ✅ Admin: Upload a new task
router.post("/upload", authMiddleware, isAdmin, taskController.uploadTask);

// ✅ Admin: Alternate route to create a task
router.post("/create-task", authMiddleware, isAdmin, taskController.createTask);

// ✅ User: Get all tasks
router.get("/all", authMiddleware, taskController.getAllTasks);

// ✅ Admin: Delete a task by ID
router.delete("/delete/:id", authMiddleware, isAdmin, taskController.deleteTaskById);

// ✅ User: Mark a task as completed
router.post("/complete", authMiddleware, taskController.completeTask);

module.exports = router;
