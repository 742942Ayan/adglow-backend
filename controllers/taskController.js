const Task = require("../models/Task");
const User = require("../models/User");
const TaskHistory = require("../models/TaskHistory");

// POST /api/task/complete/:taskId
exports.completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId;

    // 1. Task exist check
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // 2. Check if already completed
    const alreadyDone = await TaskHistory.findOne({ userId, taskId });
    if (alreadyDone) {
      return res.status(400).json({ error: "You already completed this task" });
    }

    // 3. User check
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 4. Direct reward (50%)
    const directReward = Number((task.reward * 0.5).toFixed(2));
    user.wallet = Number((user.wallet + directReward).toFixed(2));
    await user.save();

    // 5. MLM commission (50%) over 30 levels
    const mlmReward = Number((task.reward * 0.5).toFixed(2));
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

      const commission = Number((mlmReward * levelPercentages[i]).toFixed(2));
      refUser.wallet = Number((refUser.wallet + commission).toFixed(2));
      await refUser.save();

      remainingReward = Number((remainingReward - commission).toFixed(2));
      currentRef = refUser.referredBy;
    }

    // 6. Save task history
    const newHistory = new TaskHistory({
      userId,
      taskId,
      rewardEarned: directReward,
      completedAt: new Date(),
    });
    await newHistory.save();

    return res.status(200).json({
      message: "Task completed successfully",
      reward: directReward,
      mlmDistributed: Number((mlmReward - remainingReward).toFixed(2)),
      remaining: remainingReward,
    });
  } catch (err) {
    console.error("Complete Task Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
