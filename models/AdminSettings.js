const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  levelPercentages: {
    type: [Number], // Array of 30 percentages
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length === 30;
      },
      message: "Must provide exactly 30 level percentages",
    },
  },
  taskRewardShare: {
    type: Number, // e.g., 50 means 50% to user, rest to uplines
    default: 50,
  },
}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
