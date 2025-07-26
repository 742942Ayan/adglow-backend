const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Kyc = require("../models/Kyc");
const Withdrawal = require("../models/Withdrawal");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// @GET /api/admin/summary
router.get("/summary", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingKyc = await Kyc.countDocuments({ status: "pending" });

    const totalWalletBalance = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$wallet" } } },
    ]);
    const totalWallet = totalWalletBalance[0]?.total || 0;

    const totalWithdrawals = await Withdrawal.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const withdrawnAmount = totalWithdrawals[0]?.total || 0;

    res.json({
      totalUsers,
      pendingKyc,
      totalWallet,
      withdrawnAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
