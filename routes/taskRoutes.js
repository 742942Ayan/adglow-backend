const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  createTask,
  getAllTasks,
  deleteTask,
} = require("../controllers/taskController");

// ✅ POST: Create a new task (Admin only)
router.post("/", authMiddleware, isAdmin, createTask);

// ✅ GET: Get all tasks
router.get("/", authMiddleware, getAllTasks);

// ✅ DELETE: Delete a task (Admin only)
router.delete("/:taskId", authMiddleware, isAdmin, deleteTask);

module.exports = router;
