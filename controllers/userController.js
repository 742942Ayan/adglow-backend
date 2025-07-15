const User = require("../models/User");
const Kyc = require("../models/Kyc");

// ✅ GET /profile - Get logged-in user's profile
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

// ✅ POST /kyc - Upload KYC documents
exports.uploadKyc = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      fatherName,
      dob,
      documentType,
      documentNumber,
    } = req.body;

    // Validate required fields
    if (!fullName || !fatherName || !dob || !documentType || !documentNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.frontImage || !req.files?.backImage) {
      return res.status(400).json({ message: "Front and back images are required" });
    }

    const frontImage = "/uploads/kyc/" + req.files.frontImage[0].filename;
    const backImage = "/uploads/kyc/" + req.files.backImage[0].filename;

    let existing = await Kyc.findOne({ user: userId });

    // ❌ If already approved
    if (existing?.status === "approved") {
      return res.status(400).json({ message: "KYC already approved. No further upload allowed." });
    }

    // ❌ If rejected 5 times
    if (existing?.status === "rejected" && existing.uploadCount >= 5) {
      return res.status(403).json({ message: "KYC upload limit exceeded. Contact support." });
    }

    if (existing) {
      // ✅ Update existing KYC
      existing.fullName = fullName;
      existing.fatherName = fatherName;
      existing.dob = dob;
      existing.documentType = documentType;
      existing.documentNumber = documentNumber;
      existing.frontImage = frontImage;
      existing.backImage = backImage;
      existing.status = "pending";
      existing.rejectionReason = "";
      existing.uploadCount += 1;
      existing.submittedAt = new Date();
      await existing.save();
    } else {
      // ✅ New KYC submission
      const newKyc = new Kyc({
        user: userId,
        fullName,
        fatherName,
        dob,
        documentType,
        documentNumber,
        frontImage,
        backImage,
        status: "pending",
        uploadCount: 1,
      });
      await newKyc.save();
    }

    // ✅ Update user status
    await User.findByIdAndUpdate(userId, {
      kycStatus: "pending",
    });

    return res.status(200).json({ message: "KYC submitted successfully" });

  } catch (err) {
    console.error("❌ KYC Upload Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
