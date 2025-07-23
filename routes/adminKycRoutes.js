const express = require('express');
const router = express.Router();
const KYC = require('../models/kycModel');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// 🟡 Get all pending KYC requests
router.get('/pending', protect, isAdmin, async (req, res) => {
  try {
    const pendingKycs = await KYC.find({ status: 'pending' }).populate('userId', 'fullName email');
    res.json(pendingKycs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 Approve KYC
router.post('/:kycId/approve', protect, isAdmin, async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.kycId);
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });

    kyc.status = 'approved';
    kyc.reviewedAt = new Date();
    await kyc.save();

    res.json({ message: 'KYC Approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔴 Reject KYC
router.post('/:kycId/reject', protect, isAdmin, async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.kycId);
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });

    kyc.status = 'rejected';
    kyc.reviewedAt = new Date();
    await kyc.save();

    res.json({ message: 'KYC Rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
