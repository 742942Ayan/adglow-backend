const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  createTask,
  getAllTasks,
  deleteTask,
  completeTask,
} = require("../controllers/taskController");

// 🔒 Admin Only: Create a new task
router.post("/", authMiddleware, isAdmin, createTask);

// 👥 All Users: Get all available tasks
router.get("/", authMiddleware, getAllTasks);

// 🔒 Admin Only: Delete a specific task by ID
router.delete("/:taskId", authMiddleware, isAdmin, deleteTask);

// ✅ User: Mark task as completed and receive reward
router.post("/complete", authMiddleware, completeTask);

module.exports = router;
