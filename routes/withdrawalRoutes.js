const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");

// @POST /api/withdrawal/request [USER]
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

// @GET /api/withdrawal/pending [ADMIN] - View pending requests
router.get("/pending", adminMiddleware, async (req, res) => {
  try {
    const pendingRequests = await Withdrawal.find({ status: "pending" }).populate("user", "fullName email");
    res.json(pendingRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @PUT /api/withdrawal/approve/:id [ADMIN] - Approve withdrawal
router.put("/approve/:id", adminMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    if (withdrawal.status === "approved") {
      return res.status(400).json({ message: "Already approved" });
    }

    withdrawal.status = "approved";
    withdrawal.approvedAt = new Date();
    await withdrawal.save();

    res.json({ message: "Withdrawal request approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
