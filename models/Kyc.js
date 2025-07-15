const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // 1 user = 1 KYC
  },
  fullName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  documentType: {
    type: String,
    enum: [
      "Aadhar Card",
      "PAN Card",
      "Passport",
      "Voter ID",
      "Driving License",
      "National Identity Card"
    ],
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
  },
  frontImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
    default: "",
  },
  uploadCount: {
    type: Number,
    default: 1,
  }
}, { timestamps: true });

module.exports = mongoose.model("Kyc", kycSchema);
