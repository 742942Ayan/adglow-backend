const User = require('../models/userModel');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ totalEarnings: -1 })
      .limit(10)
      .select('fullName email totalEarnings');

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getLeaderboard };
