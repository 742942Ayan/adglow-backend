const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");

// 🔐 Admin Route: Create a new task
router.post("/create", authenticate, isAdmin, taskController.createTask);

// 🧠 User Route: Get all tasks by platform (e.g. YouTube, Instagram)
router.get("/fetch", authenticate, taskController.getTasksByPlatform);

module.exports = router;
