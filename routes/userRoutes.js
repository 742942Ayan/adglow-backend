const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  getUserProfile,
  uploadKyc,
} = require("../controllers/userController");

// ✅ GET user profile (secured)
router.get("/profile", authMiddleware, getUserProfile);

// ✅ POST KYC submission with file upload and auth
router.post(
  "/kyc",
  authMiddleware,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  uploadKyc
);

module.exports = router;
