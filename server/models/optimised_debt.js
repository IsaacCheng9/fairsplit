const mongoose = require("mongoose");

// Create a copy of the debt schema to store debts after they have been
// simplified to minimise the total number of transactions.
const optimisedDebtSchema = new mongoose.Schema({
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

module.exports = mongoose.model("optimised_debt", optimisedDebtSchema);
