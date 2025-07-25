// controllers/taskController.js
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const { distributeReferralCommission } = require("../utils/referralUtils");

exports.completeTaskAndReward = async (req, res) => {
  try {
    const { userId, taskId, rewardAmount } = req.body;

    // 1. Check user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Add main reward to user's wallet
    await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: rewardAmount } },
      { upsert: true, new: true }
    );

    // 3. Distribute 30-level referral commissions
    await distributeReferralCommission(userId, rewardAmount);

    return res.status(200).json({
      message: "Task completed, reward credited and referral commission distributed.",
    });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
