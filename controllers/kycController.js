const Kyc = require("../models/Kyc");
const User = require("../models/User");

// ✅ Submit or Resubmit KYC
exports.submitKyc = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      fatherName,
      dob,
      documentType,
      documentNumber,
      frontImage,
      backImage
    } = req.body;

    if (!fullName || !fatherName || !dob || !documentType || !documentNumber || !frontImage || !backImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingKyc = await Kyc.findOne({ user: userId });

    if (existingKyc) {
      if (existingKyc.status === "approved") {
        return res.status(400).json({ message: "KYC already approved" });
      }

      if (existingKyc.uploadCount >= 5) {
        return res.status(400).json({ message: "Maximum 5 attempts allowed. You cannot upload more." });
      }

      // Update existing KYC
      existingKyc.fullName = fullName;
      existingKyc.fatherName = fatherName;
      existingKyc.dob = dob;
      existingKyc.documentType = documentType;
      existingKyc.documentNumber = documentNumber;
      existingKyc.frontImage = frontImage;
      existingKyc.backImage = backImage;
      existingKyc.status = "pending";
      existingKyc.rejectionReason = "";
      existingKyc.uploadCount += 1;

      await existingKyc.save();
      await User.findByIdAndUpdate(userId, { kycStatus: "pending" });

      return res.status(200).json({ message: "KYC re-submitted successfully" });
    } else {
      // New KYC
      const newKyc = new Kyc({
        user: userId,
        fullName,
        fatherName,
        dob,
        documentType,
        documentNumber,
        frontImage,
        backImage,
      });

      await newKyc.save();
      await User.findByIdAndUpdate(userId, { kycStatus: "pending" });

      return res.status(201).json({ message: "KYC submitted successfully" });
    }
  } catch (err) {
    console.error("❌ KYC Submission Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get current KYC details
exports.getMyKyc = async (req, res) => {
  try {
    const kyc = await Kyc.findOne({ user: req.user._id });
    if (!kyc) return res.status(404).json({ message: "No KYC found" });
    res.json(kyc);
  } catch (err) {
    console.error("❌ Get KYC Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
