const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTask,
  getAllTasks,
  getUserTasks,
  submitTaskCompletion,
} = require("../controllers/taskController");

// POST /api/tasks/create — Admin creates a task
router.post("/create", authMiddleware, createTask);

// GET /api/tasks — Get all tasks (public or user)
router.get("/", authMiddleware, getAllTasks);

// GET /api/tasks/user — Get tasks completed by the user
router.get("/user", authMiddleware, getUserTasks);

// POST /api/tasks/submit — Submit a completed task
router.post("/submit", authMiddleware, submitTaskCompletion);

module.exports = router;
