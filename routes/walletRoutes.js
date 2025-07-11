// Wallet routes: Earnings, Withdraw
const express = require("express");
const router = express.Router();

// @route POST /api/wallet/withdraw
// @desc Request withdrawal
router.post("/withdraw", (req, res) => {
  res.send("Withdrawal requested");
});

module.exports = router;
