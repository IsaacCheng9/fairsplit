const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
  from: {
    type: String,
    max: [30, "Username must be within 30 characters."],
    required: true,
  },
  to: {
    type: String,
    max: [30, "Username must be within 30 characters."],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("debt", debtSchema);
