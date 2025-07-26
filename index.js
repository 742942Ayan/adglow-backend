// ✅ 1. Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// ✅ 2. Required dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

// ✅ 3. App setup
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ 4. Middleware
app.use(cors());
app.use(express.json());

// ✅ 5. Ensure uploads/kyc folder exists
const kycDir = path.join(__dirname, "uploads", "kyc");
if (!fs.existsSync(kycDir)) {
  fs.mkdirSync(kycDir, { recursive: true });
}

// ✅ 6. Serve uploaded KYC images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 7. Connect to MongoDB
connectDB();

// ✅ 8. Import All Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes"); // ✅ This was missing
const walletRoutes = require("./routes/walletRoutes");
const teamRoutes = require("./routes/teamRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const referralRoutes = require("./routes/referralRoutes");

// ✅ 9. Use All Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/withdrawal", withdrawalRoutes);
app.use("/api/referral", referralRoutes);

// ✅ 10. Test route
app.get("/", (req, res) => {
  res.send("🎉 AdGlow Backend is Running");
});

// ✅ 11. Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
