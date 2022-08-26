const mongoose = require("mongoose");

const userDebtSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    max: [30, "Username must be within 30 characters."],
    required: true,
  },
  // Positive means they owe users money, negative means they're owed money.
  netDebt: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("user_debt", userDebtSchema);
