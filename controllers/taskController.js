// controllers/taskController.js

const Wallet = require("../models/Wallet");
const User = require("../models/User");
const AdminSettings = require("../models/AdminSettings");
const distributeReferralEarnings = require("../utils/distributeReferralEarnings");

// ✅ Task Completion Controller
const completeTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId, rewardAmount } = req.body;

    // Basic validation
    if (!taskId || !rewardAmount || isNaN(rewardAmount)) {
      return res.status(400).json({ message: "Task ID and valid reward amount are required." });
    }

    const reward = parseFloat(rewardAmount);
    const userShare = reward * 0.5;
    const referralShare = reward * 0.5;

    // ✅ Step 1: Credit 50% to the user
    await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: userShare, totalEarned: userShare } },
      { upsert: true, new: true }
    );

    // ✅ Step 2: Distribute 50% among referral tree
    await distributeReferralEarnings(userId, referralShare);

    return res.status(200).json({
      message: "✅ Task completed successfully. Earnings distributed.",
      userEarned: userShare,
      referralDistributed: referralShare,
    });
  } catch (error) {
    console.error("❌ Task completion error:", error.message);
    return res.status(500).json({ message: "❌ Task completion failed. Please try again." });
  }
};

module.exports = {
  completeTask,
};
