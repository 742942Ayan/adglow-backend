const Wallet = require("../models/Wallet");
const User = require("../models/User");
const AdminSettings = require("../models/AdminSettings");
const distributeReferralEarnings = require("../utils/distributeReferralEarnings");

// ✅ Upload Task - dummy example (you can customize)
const uploadTask = async (req, res) => {
  try {
    return res.status(200).json({ message: "Task uploaded (dummy)" });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed" });
  }
};

// ✅ Get All Tasks - dummy example
const getAllTasks = async (req, res) => {
  try {
    return res.status(200).json({ message: "All tasks fetched (dummy)" });
  } catch (error) {
    return res.status(500).json({ message: "Fetch failed" });
  }
};

// ✅ Delete Task By ID - dummy example
const deleteTaskById = async (req, res) => {
  try {
    return res.status(200).json({ message: `Task ${req.params.id} deleted (dummy)` });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

// ✅ Complete Task - working controller
const completeTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId, rewardAmount } = req.body;

    if (!taskId || !rewardAmount || isNaN(rewardAmount)) {
      return res.status(400).json({ message: "Task ID and valid reward amount are required." });
    }

    const reward = parseFloat(rewardAmount);
    const userShare = reward * 0.5;
    const referralShare = reward * 0.5;

    await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: userShare, totalEarned: userShare } },
      { upsert: true, new: true }
    );

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

// ✅ Export all controllers
module.exports = {
  uploadTask,
  getAllTasks,
  deleteTaskById,
  completeTask,
};
