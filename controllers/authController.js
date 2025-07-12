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
      referredBy
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code (unique)
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create user
    const tempUser = new User({
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

    await tempUser.save();

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
