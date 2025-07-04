const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AdGlow Backend is live!');
});

// Example route
// app.use('/api/kyc', require('./routes/kycRoute'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
