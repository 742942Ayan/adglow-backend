const Task = require("../models/Task");
const User = require("../models/User");
const TaskHistory = require("../models/TaskHistory");

// POST /api/task/complete/:taskId
exports.completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Already completed?
    const alreadyDone = await TaskHistory.findOne({ userId, taskId });
    if (alreadyDone) {
      return res.status(400).json({ error: "You already completed this task" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Direct reward (50%)
    const directReward = task.reward * 0.5;
    user.wallet += directReward;
    await user.save();

    // 2. MLM commission (50%) over 30 levels
    const mlmReward = task.reward * 0.5;
    let remainingReward = mlmReward;
    let currentRef = user.referredBy;
    const levelPercentages = [
      0.20, 0.10, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01, 0.01, 0.01,
      0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005,
      0.002, 0.002, 0.002, 0.002, 0.002, 0.001, 0.001, 0.001, 0.001, 0.001
    ];

    for (let i = 0; i < 30; i++) {
      if (!currentRef) break;

      const refUser = await User.findById(currentRef);
      if (!refUser) break;

      const commission = mlmReward * levelPercentages[i];
      refUser.wallet += commission;
      await refUser.save();

      remainingReward -= commission;
      currentRef = refUser.referredBy;
    }

    // 3. Store Task History
    const newHistory = new TaskHistory({
      userId,
      taskId,
      rewardEarned: directReward,
      completedAt: new Date(),
    });
    await newHistory.save();

    res.status(200).json({
      message: "Task completed successfully",
      reward: directReward,
      mlmDistributed: mlmReward - remainingReward,
      remaining: remainingReward
    });
  } catch (err) {
    console.error("Complete Task Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
