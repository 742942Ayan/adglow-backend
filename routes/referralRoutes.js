const express = require("express");
const router = express.Router();
const { getUplines } = require("../controllers/referralController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Protected route to fetch 30-level uplines
router.get("/uplines", authMiddleware, getUplines);

module.exports = router;
