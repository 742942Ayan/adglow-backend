// ✅ 1. Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// ✅ 2. Required dependencies
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ✅ 3. App setup
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ 4. Middleware
app.use(cors());
app.use(express.json());

// ✅ 5. Connect to MongoDB
connectDB();

// ✅ 6. All Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ✅ 7. Test route
app.get("/", (req, res) => {
  res.send("🎉 AdGlow Backend is Running");
});

// ✅ 8. Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
