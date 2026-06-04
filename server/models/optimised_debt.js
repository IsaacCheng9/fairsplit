const mongoose = require("mongoose");

// Create a copy of the debt schema to store debts after they have been
// simplified to minimise the total number of transactions.
const optimisedDebtSchema = new mongoose.Schema({
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

module.exports = mongoose.model("optimised_debt", optimisedDebtSchema);
