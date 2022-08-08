const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    max: [50, "Title must have fewer than 50 characters."],
    required: true,
  },
  author: {
    type: String,
    lowercase: true,
    required: true,
  },
  creationDatetime: {
    type: Date,
    default: Date.now,
  },
  lender: {
    type: String,
    lowercase: true,
    required: true,
  },
  borrowers: [
    {
      // Each element represents the borrower name and the amount they owe.
      type: [String, Number],
      required: true,
    },
  ],
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be greater than £0."],
    max: [1000000, "Amount must be less than £1000000."],
  },
});

module.exports = mongoose.model("expense", expenseSchema);
