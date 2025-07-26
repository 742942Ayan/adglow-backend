// Get all KYC requests
router.get('/all', authMiddleware, isAdmin, async (req, res) => {
  const kycs = await Kyc.find().populate('user', 'fullName email');
  res.json(kycs);
});

// Approve KYC
router.post('/approve/:id', authMiddleware, isAdmin, async (req, res) => {
  const kyc = await Kyc.findById(req.params.id);
  if (!kyc) return res.status(404).json({ error: 'KYC not found' });
  kyc.status = 'approved';
  await kyc.save();
  res.json({ message: 'KYC approved' });
});
