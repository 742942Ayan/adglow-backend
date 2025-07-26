// routes/taskRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const {
  uploadTask,
  getAllTasks,
  deleteTaskById,
  completeTask,
} = require("../controllers/taskController");

// ✅ Admin: Upload a new task
router.post("/upload", authMiddleware, isAdmin, uploadTask);

// ✅ User: Get all tasks
router.get("/all", authMiddleware, getAllTasks);

// ✅ Admin: Delete a task by ID
router.delete("/delete/:id", authMiddleware, isAdmin, deleteTaskById);

// ✅ User: Mark a task as completed
router.post("/complete", authMiddleware, completeTask);

module.exports = router;
