const Wallet = require("../models/Wallet");
const User = require("../models/User");
const AdminSettings = require("../models/AdminSettings");
const distributeReferralEarnings = require("../utils/distributeReferralEarnings");

// ✅ Upload Task (Dummy for now - to be replaced with real logic)
const uploadTask = async (req, res) => {
  try {
    return res.status(200).json({ message: "Task uploaded successfully (dummy)." });
  } catch (error) {
    return res.status(500).json({ message: "Task upload failed.", error: error.message });
  }
};

// ✅ Get All Tasks (Dummy for now - to be replaced with DB fetch)
const getAllTasks = async (req, res) => {
  try {
    return res.status(200).json({ message: "All tasks fetched successfully (dummy)." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks.", error: error.message });
  }
};

// ✅ Delete Task by ID (Dummy for now - to be replaced with DB delete)
const deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ message: `Task with ID ${id} deleted successfully (dummy).` });
  } catch (error) {
    return res.status(500).json({ message: "Task deletion failed.", error: error.message });
  }
};

// ✅ Complete Task (Real Logic)
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

    // Update user's wallet
    await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: userShare, totalEarned: userShare } },
      { upsert: true, new: true }
    );

    // Distribute referral earnings
    await distributeReferralEarnings(userId, referralShare);

    return res.status(200).json({
      message: "Task completed successfully. Earnings distributed.",
      userEarned: userShare,
      referralDistributed: referralShare,
    });
  } catch (error) {
    console.error("Task completion error:", error.message);
    return res.status(500).json({ message: "Task completion failed.", error: error.message });
  }
};

// ✅ Export controllers
module.exports = {
  uploadTask,
  getAllTasks,
  deleteTaskById,
  completeTask,
};
