const User = require("../models/User");
const Kyc = require("../models/Kyc");

// ✅ GET /profile - Get logged-in user's profile + KYC
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    // 🔍 Get user's KYC info (if exists)
    const kyc = await Kyc.findOne({ user: user._id });

    return res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      country: user.country,
      state: user.state,
      district: user.district,
      address: user.address,
      pincode: user.pincode,
      gender: user.gender,
      dob: user.dob,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      walletBalance: user.walletBalance || 0,
      kycStatus: user.kycStatus || "pending",

      // 🆕 Include KYC details if present
      kycFrontImageUrl: kyc?.frontImage ? `https://adglow-backend.onrender.com${kyc.frontImage}` : null,
      kycBackImageUrl: kyc?.backImage ? `https://adglow-backend.onrender.com${kyc.backImage}` : null,
      kycRejectionReason: kyc?.rejectionReason || "",
      kycAttempts: kyc?.uploadCount || 0,
    });
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
