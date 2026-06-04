const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
  from: {
    type: String,
    lowercase: true,
    maxlength: [30, "Username must be within 30 characters."],
    required: true,
  },
  to: {
    type: String,
    lowercase: true,
    maxlength: [30, "Username must be within 30 characters."],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "Amount must be greater than 0 pence."],
  },
});

module.exports = mongoose.model("debt", debtSchema);
