const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  accountHolder: String,
  accountNumber: String,
  ifscCode: String,
  upiId: String,
  requestedAt: { type: Date, default: Date.now },
  actionDate: Date,
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
