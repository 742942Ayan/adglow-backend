const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  getUserProfile,
} = require("../controllers/userController");
const {
  uploadKyc,
  getMyKyc,
} = require("../controllers/kycController");

// ✅ Get user profile
router.get("/profile", authMiddleware, getUserProfile);

// ✅ Submit or re-submit KYC with file upload
router.post(
  "/kyc",
  authMiddleware,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  uploadKyc
);

// ✅ Get current user's KYC details
router.get("/kyc", authMiddleware, getMyKyc);

module.exports = router;
