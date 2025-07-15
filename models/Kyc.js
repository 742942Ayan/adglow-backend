const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  documentType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  frontImageUrl: { type: String, required: true },
  backImageUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: { type: String, default: "" },
  attempts: { type: Number, default: 1 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Kyc", kycSchema);
