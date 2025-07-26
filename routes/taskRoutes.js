const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  createTask,
  getAllTasks,
  deleteTask,
  completeTask, // ✅ Added
} = require("../controllers/taskController");

// ✅ POST: Create a new task (Admin only)
router.post("/", authMiddleware, isAdmin, createTask);

// ✅ GET: Get all tasks (accessible to all logged-in users)
router.get("/", authMiddleware, getAllTasks);

// ✅ DELETE: Delete a task by ID (Admin only)
router.delete("/:taskId", authMiddleware, isAdmin, deleteTask);

// ✅ POST: Complete a task (User triggers this when done)
router.post("/complete", authMiddleware, completeTask);

module.exports = router;
