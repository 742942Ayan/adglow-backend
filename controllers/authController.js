const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
      referredBy,
    } = req.body;

    const lowerEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });

    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

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
      emailVerified: false,
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
    const trimmedOtp = otp.toString().trim();

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

// 📌 Login with Email & Password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.trim().toLowerCase();

    // ✅ FIXED: Select password explicitly
    const user = await User.findOne({ email: lowerEmail }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    console.log("🔐 JWT_SECRET FROM ENV:", process.env.JWT_SECRET);
    console.log("🔐 User Password (Hashed):", user.password);
    console.log("🔐 Password Entered:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📌 Forgot Password → Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const lowerEmail = email.trim().toLowerCase();

    console.log("🔐 Forgot Password - Email:", lowerEmail); // ✅ DEBUG LOG

    const user = await User.findOne({ email: lowerEmail });
    if (!user || !user.emailVerified) {
      return res.status(404).json({ message: "User not found or email not verified" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("🔐 OTP Generated:", otpCode); // ✅ DEBUG LOG

    await Otp.deleteMany({ email: lowerEmail });
    await Otp.create({ email: lowerEmail, otp: otpCode });

    await sendOtpEmail(lowerEmail, otpCode);
    return res.status(200).json({ message: "OTP sent to your email for password reset" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📌 Update Password after OTP verification
exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const lowerEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: lowerEmail });
    if (!user || !user.emailVerified) {
      return res.status(404).json({ message: "User not found or email not verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("❌ Update Password Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

