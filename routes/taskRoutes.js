const express = require("express");
const router = express.Router();
const { uploadTask, getAllTasks, deleteTaskById } = require("../controllers/taskController");

// Route to upload a task (POST)
router.post("/upload", uploadTask);

// Route to get all tasks (GET)
router.get("/all", getAllTasks);

// Route to delete a task by ID (DELETE)
router.delete("/delete/:id", deleteTaskById);

module.exports = router;
