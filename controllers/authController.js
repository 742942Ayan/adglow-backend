// controllers/authController.js

const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/emailService");

// 📌 Register user and send OTP
exports.register = async (req, res) => {
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
      mobile,
      email,
      password,
      referredBy,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code (8 character unique)
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Save new user (unverified)
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
      mobile,
      email,
      password: hashedPassword,
      referralCode,
      referredBy: referredBy || null,
      emailVerified: false,
    });

    await newUser.save();

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Otp.create({ email, otp: otpCode });

    // Send OTP to email
    await sendOtpEmail(email, otpCode);

    return res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
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

    // Mark user email as verified
    await User.updateOne({ email }, { $set: { emailVerified: true } });

    // Delete all OTPs for that email
    await Otp.deleteMany({ email });

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
