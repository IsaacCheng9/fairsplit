const mongoose = require("mongoose");

const userDebtSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    max: [30, "Username must be within 30 characters."],
    required: true,
  },
  netDebt: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("user_debt", userDebtSchema);
