const Kyc = require("../models/Kyc");
const User = require("../models/User");
const path = require("path");

exports.uploadKyc = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if files are uploaded
    if (!req.files || !req.files.frontImage || !req.files.backImage) {
      return res.status(400).json({ message: "Both front and back images are required." });
    }

    const { fullName, fatherName, dob, documentType, documentNumber } = req.body;

    // Validate mandatory fields
    if (!fullName || !fatherName || !dob || !documentType || !documentNumber) {
      return res.status(400).json({ message: "All KYC fields are required." });
    }

    // Check if KYC already exists for user
    let existing = await Kyc.findOne({ user: userId });

    // Prevent if already 5 failed attempts
    if (existing && existing.uploadCount >= 5 && existing.status === "rejected") {
      return res.status(403).json({ message: "KYC upload limit exceeded. You cannot upload again." });
    }

    const frontImagePath = `/uploads/${req.files.frontImage[0].filename}`;
    const backImagePath = `/uploads/${req.files.backImage[0].filename}`;

    if (existing) {
      // Re-upload (on rejection)
      existing.fullName = fullName;
      existing.fatherName = fatherName;
      existing.dob = dob;
      existing.documentType = documentType;
      existing.documentNumber = documentNumber;
      existing.frontImage = frontImagePath;
      existing.backImage = backImagePath;
      existing.status = "pending";
      existing.rejectionReason = "";
      existing.uploadCount += 1;
      await existing.save();
    } else {
      // New KYC
      await Kyc.create({
        user: userId,
        fullName,
        fatherName,
        dob,
        documentType,
        documentNumber,
        frontImage: frontImagePath,
        backImage: backImagePath,
      });
    }

    // Update user's KYC status
    await User.findByIdAndUpdate(userId, { kycStatus: "pending" });

    return res.status(200).json({ message: "KYC submitted successfully." });
  } catch (err) {
    console.error("❌ KYC Upload Error:", err);
    return res.status(500).json({ message: "KYC submission failed", error: err.message });
  }
};

// ✅ Get current user's KYC status and data
exports.getMyKyc = async (req, res) => {
  try {
    const userId = req.user._id;
    const kyc = await Kyc.findOne({ user: userId });

    if (!kyc) {
      return res.status(404).json({ message: "No KYC submitted yet." });
    }

    return res.status(200).json(kyc);
  } catch (err) {
    console.error("❌ Get KYC Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
