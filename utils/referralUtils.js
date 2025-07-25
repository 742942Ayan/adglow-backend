const User = require("../models/userModel");
const Wallet = require("../models/walletModel");

const levelPercentages = [
  10, 9, 8, 7, 6, 5, 4, 3, 2.5, 2, // levels 1–10
  1.5, 1.4, 1.3, 1.2, 1.1, 1, 0.9, 0.8, 0.7, 0.6, // 11–20
  0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05, 0.05, 0.05 // 21–30
];

const distributeReferralEarnings = async (userId, totalAmount) => {
  try {
    const referralShare = totalAmount * 0.5; // 50% distributed to uplines
    let currentUser = await User.findById(userId);
    let currentReferrer = currentUser.referredBy;

    for (let level = 0; level < 30 && currentReferrer; level++) {
      const percentage = levelPercentages[level] || 0;
      const earning = (referralShare * percentage) / 100;

      await Wallet.findOneAndUpdate(
        { userId: currentReferrer },
        { $inc: { balance: earning, referralIncome: earning } },
        { upsert: true, new: true }
      );

      const refUser = await User.findOne({ referralCode: currentReferrer });
      currentReferrer = refUser?.referredBy;
    }
  } catch (err) {
    console.error("Referral earning distribution error:", err);
  }
};

module.exports = { distributeReferralEarnings };
