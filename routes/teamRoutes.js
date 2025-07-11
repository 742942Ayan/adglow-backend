// Team routes: MLM tree
const express = require("express");
const router = express.Router();

// @route GET /api/team/tree
// @desc Get user's referral tree
router.get("/tree", (req, res) => {
  res.send("Referral tree");
});

module.exports = router;
