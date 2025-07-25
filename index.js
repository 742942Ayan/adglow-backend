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

// ✅ 8. All Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/withdrawal", require("./routes/withdrawalRoutes"));
app.use("/api/referral", require("./routes/referralRoutes")); // ✅ Newly added

// ✅ 9. Test route
app.get("/", (req, res) => {
  res.send("🎉 AdGlow Backend is Running");
});

// ✅ 10. Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
