// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  deleteTask,
  assignTaskToUser,
  getUserTasks,
  submitTaskProof,
  getTaskHistory,
} = require('../controllers/taskController');

// Admin Routes
router.post('/create', createTask);
router.get('/all', getAllTasks);
router.delete('/:id', deleteTask);

// User Task Assign & Submit
router.post('/assign/:taskId/:userId', assignTaskToUser);
router.get('/assigned/:userId', getUserTasks);
router.post('/submit/:taskId/:userId', submitTaskProof);

// Task history
router.get('/history/:userId', getTaskHistory);

module.exports = router;
