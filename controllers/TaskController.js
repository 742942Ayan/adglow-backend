const Task = require("../models/Task");
const User = require("../models/User");
const TaskHistory = require("../models/TaskHistory");

// ✅ Admin - Create Task
const createTask = async (req, res) => {
  try {
    const { platform, title, description, link, reward, watchTime } = req.body;

    const newTask = new Task({
      platform,
      title,
      description,
      link,
      reward,
      watchTime,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// ✅ User - Get Tasks by Platform
const getTasksByPlatform = async (req, res) => {
  try {
    const { platform } = req.query;
    const tasks = await Task.find(platform ? { platform } : {});
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ User - Complete Task & Earn Reward
const completeTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Check if already completed
    const alreadyCompleted = await TaskHistory.findOne({ userId, taskId });
    if (alreadyCompleted) return res.status(400).json({ error: "Task already completed" });

    // Reward Distribution
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const directReward = task.reward * 0.5;
    user.wallet += directReward;
    await user.save();

    // MLM commission
    const commissionAmount = task.reward * 0.5;
    let refCode = user.referralCode;
    const levelPercentages = [
      20, 10, 5, 5, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ];

    for (let i = 0; i < levelPercentages.length; i++) {
      if (!refCode) break;
      const refUser = await User.findOne({ myReferralCode: refCode });
      if (!refUser) break;

      const levelEarning = (commissionAmount * levelPercentages[i]) / 100;
      refUser.wallet += levelEarning;
      await refUser.save();
      refCode = refUser.referralCode;
    }

    // Log task history
    const history = new TaskHistory({ userId, taskId });
    await history.save();

    res.status(200).json({ message: "Task completed and reward credited" });
  } catch (error) {
    console.error("Complete Task Error:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
};

// ✅ Export all controllers
module.exports = {
  createTask,
  getTasksByPlatform,
  completeTask,
};
