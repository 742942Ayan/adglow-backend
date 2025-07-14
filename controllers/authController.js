const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/emailService");

// 📌 Register User & Send OTP
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
      referredBy
    } = req.body;

    const lowerEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: lowerEmail });

    // ✅ Already registered & verified
    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Exists but not verified — resend OTP
    if (existingUser && !existingUser.emailVerified) {
      existingUser.fullName = fullName;
      existingUser.fatherName = fatherName;
      existingUser.dob = dob;
      existingUser.gender = gender;
      existingUser.address = address;
      existingUser.country = country;
      existingUser.state = state;
      existingUser.district = district;
      existingUser.pincode = pincode;
      existingUser.mobile = mobile;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.deleteMany({ email: lowerEmail });
      await Otp.create({ email: lowerEmail, otp: otpCode });
      await sendOtpEmail(lowerEmail, otpCode);

      return res.status(200).json({ message: "OTP re-sent to your email." });
    }

    // ✅ New User
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

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
      email: lowerEmail,
      password: hashedPassword,
      referralCode,
      referredBy: referredBy || null,
      emailVerified: false
    });

    await newUser.save();

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email: lowerEmail, otp: otpCode });
    await sendOtpEmail(lowerEmail, otpCode);

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
    const lowerEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    const validOtp = await Otp.findOne({ email: lowerEmail, otp: trimmedOtp });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.updateOne({ email: lowerEmail }, { $set: { emailVerified: true } });
    await Otp.deleteMany({ email: lowerEmail });

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
