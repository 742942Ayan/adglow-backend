// 📍 File: routes/kycRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const Kyc = require('../models/Kyc'); // Make sure this file exists and is correctly defined
const User = require('../models/User'); // Optional: Used for populate

// ✅ Get all KYC requests
router.get('/all', authMiddleware, isAdmin, async (req, res) => {
  try {
    const kycs = await Kyc.find().populate('user', 'fullName email');
    res.json(kycs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Approve KYC by ID
router.post('/approve/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const kyc = await Kyc.findById(req.params.id);
    if (!kyc) return res.status(404).json({ error: 'KYC not found' });

    kyc.status = 'approved';
    await kyc.save();

    res.json({ message: 'KYC approved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Reject KYC by ID (optional)
router.post('/reject/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const kyc = await Kyc.findById(req.params.id);
    if (!kyc) return res.status(404).json({ error: 'KYC not found' });

    kyc.status = 'rejected';
    await kyc.save();

    res.json({ message: 'KYC rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
