// controllers/taskController.js

const Wallet = require("../models/Wallet");
const User = require("../models/User");
const AdminSettings = require("../models/AdminSettings");
const distributeReferralEarnings = require("../utils/distributeReferralEarnings");

// ✅ Task Completion Controller
const completeTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId, rewardAmount } = req.body; // rewardAmount = total task reward (e.g. ₹10)

    if (!taskId || !rewardAmount) {
      return res.status(400).json({ message: "Task ID and reward amount are required." });
    }

    // ✅ Step 1: Credit 50% to user
    const userShare = rewardAmount * 0.5;

    await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: userShare, totalEarned: userShare } },
      { upsert: true }
    );

    // ✅ Step 2: Distribute 50% among uplines
    const referralShare = rewardAmount * 0.5;

    await distributeReferralEarnings(userId, referralShare);

    return res.status(200).json({
      message: "Task completed, earnings distributed.",
      userEarned: userShare,
      referralDistributed: referralShare,
    });
  } catch (error) {
    console.error("Task completion error:", error);
    return res.status(500).json({ message: "Task completion failed" });
  }
};

module.exports = {
  completeTask,
};
