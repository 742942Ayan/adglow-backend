// controllers/authController.js

const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/emailService");

// 📌 Register user and send OTP
exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      dob,
      gender,
      address,
      country,
      state,
      district,
      pincode,
      email,
      mobile,
      referralCode,
    } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user with emailVerified: false
    const newUser = new User({
      fullName,
      fatherName,
      dob,
      gender,
      address,
      country,
      state,
      district,
      pincode,
      email,
      mobile,
      referralCode,
      referralName: "", // TODO: auto-fill referral name
      emailVerified: false,
    });

    await newUser.save();

    // Save OTP in DB
    await Otp.create({ email, otp: otpCode });

    // Send OTP via email
    await sendOtpEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.updateOne({ email }, { $set: { emailVerified: true } });
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("❌ OTP verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
