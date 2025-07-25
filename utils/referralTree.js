// utils/referralTree.js

const User = require("../models/userModel");

// Function to get upline referral chain up to 30 levels
const getUplineReferralChain = async (userId, levels = 30) => {
  const chain = [];

  let currentUser = await User.findById(userId).select("referralCodeUsed");
  let level = 1;

  while (currentUser && currentUser.referralCodeUsed && level <= levels) {
    const referrer = await User.findOne({
      ownReferralCode: currentUser.referralCodeUsed,
    });

    if (!referrer) break;

    chain.push({
      level,
      userId: referrer._id,
      fullName: referrer.fullName,
      email: referrer.email,
    });

    currentUser = referrer;
    level++;
  }

  return chain;
};

module.exports = {
  getUplineReferralChain,
};
