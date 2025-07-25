// utils/distributeReferralEarnings.js

const User = require("../models/User");
const Wallet = require("../models/Wallet");
const AdminSettings = require("../models/AdminSettings");

const distributeReferralEarnings = async (userId, totalAmount) => {
  try {
    // Fetch commission percentages (default fallback if admin not set)
    let settings = await AdminSettings.findOne();
    let levelPercents = settings?.referralCommissionPercent || [];

    if (levelPercents.length < 30) {
      // fallback: 30 levels, each gets equal 1.67% of 50% pool
      levelPercents = Array(30).fill(100 / 30);
    }

    let currentUser = await User.findById(userId);
    for (let level = 0; level < 30; level++) {
      if (!currentUser || !currentUser.referredBy) break;

      const upline = await User.findById(currentUser.referredBy);
      if (!upline) break;

      const percent = levelPercents[level] || 0;
      const levelShare = (totalAmount * percent) / 100;

      if (levelShare > 0) {
        await Wallet.findOneAndUpdate(
          { user: upline._id },
          {
            $inc: {
              balance: levelShare,
              totalEarned: levelShare,
              [`levelIncome.level${level + 1}`]: levelShare,
            },
          },
          { upsert: true }
        );
      }

      currentUser = upline;
    }
  } catch (error) {
    console.error("Referral distribution error:", error);
  }
};

module.exports = distributeReferralEarnings;
