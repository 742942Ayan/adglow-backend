const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");

// @POST /api/withdrawal/request
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { amount, accountHolder, accountNumber, ifscCode, upiId } = req.body;

    if (amount < 100) {
      return res.status(400).json({ message: "Minimum withdrawal ₹100 required" });
    }

    const user = await User.findById(req.user.id);

    if (user.wallet < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newRequest = new Withdrawal({
      user: user._id,
      amount,
      accountHolder,
      accountNumber,
      ifscCode,
      upiId,
    });

    await newRequest.save();

    user.wallet -= amount;
    await user.save();

    res.json({ message: "Withdrawal request submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
