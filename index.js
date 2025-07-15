// ✅ 1. सबसे पहले .env config करो
const dotenv = require("dotenv");
dotenv.config();

// ✅ 2. फिर बाकी import करो
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ✅ 3. Setup
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ 4. Connect to MongoDB
connectDB();

// ✅ 5. Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ✅ 6. Test route
app.get("/", (req, res) => {
  res.send("🎉 AdGlow Backend is Running");
});

// ✅ 7. Start server
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
