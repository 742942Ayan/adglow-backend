// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: String, required: true },
  mobile: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  referralCode: {
    type: String,
    required: true,
    unique: true,
  },

  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  referralName: {
    type: String,
    default: "",
  },

  referrals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
