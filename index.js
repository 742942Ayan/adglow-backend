// Entry point of AdGlow Backend
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Import routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("🎉 AdGlow Backend is Running");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
