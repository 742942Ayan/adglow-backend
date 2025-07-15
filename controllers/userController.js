exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;

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
    });
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
