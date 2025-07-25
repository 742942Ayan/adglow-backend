const User = require("../models/User");

// 📌 Get 30-level uplines of the logged-in user
exports.getUplines = async (req, res) => {
  try {
    const userId = req.user.userId;
    const uplines = [];

    let currentUser = await User.findById(userId).populate("referredBy");

    for (let level = 1; level <= 30; level++) {
      if (!currentUser || !currentUser.referredBy) break;

      const referrer = await User.findById(currentUser.referredBy);

      if (!referrer) break;

      uplines.push({
        level,
        fullName: referrer.fullName,
        email: referrer.email,
        referralCode: referrer.referralCode,
        userId: referrer._id,
      });

      currentUser = referrer;
    }

    return res.status(200).json({
      message: "Upline tree fetched successfully",
      uplines,
    });
  } catch (err) {
    console.error("❌ Upline Fetch Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
