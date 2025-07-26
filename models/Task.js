const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["YouTube", "Instagram", "Facebook", "Telegram", "Ecommerce"],
    },
    taskType: {
      type: String,
      required: true,
      enum: ["Subscribe", "Like", "Comment", "View", "Follow", "Join", "Buy"],
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    reward: {
      type: Number,
      required: true,
    },
    watchTime: {
      type: Number, // in seconds (optional)
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // optional if you have admin schema
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
