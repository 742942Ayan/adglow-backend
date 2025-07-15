// User routes: KYC, Profile
const express = require("express");
const router = express.Router();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;


// @route POST /api/user/kyc
// @desc Submit KYC form
router.post("/kyc", (req, res) => {
  res.send("KYC submitted");
});

module.exports = router;
