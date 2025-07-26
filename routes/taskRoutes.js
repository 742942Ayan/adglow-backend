const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// ✅ IMPORT CONTROLLER FUNCTIONS
const {
  createTask,
  uploadTask,
  getAllTasks,
  deleteTaskById,
  completeTask,
} = require("../controllers/taskController");

// ✅ ROUTES
router.post("/upload", authMiddleware, isAdmin, uploadTask);
router.post("/create-task", authMiddleware, isAdmin, createTask);
router.get("/all", authMiddleware, getAllTasks);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteTaskById);
router.post("/complete", authMiddleware, completeTask);

module.exports = router;
