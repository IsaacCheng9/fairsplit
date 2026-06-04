const mongoose = require("mongoose");

function isValidBorrowers(borrowers) {
  return (
    Array.isArray(borrowers) &&
    borrowers.length > 0 &&
    borrowers.every((borrower) => {
      return (
        Array.isArray(borrower) &&
        borrower.length === 2 &&
        typeof borrower[0] === "string" &&
        borrower[0].length > 0 &&
        borrower[0].length <= 30 &&
        Number.isInteger(borrower[1]) &&
        borrower[1] > 0
      );
    })
  );
}

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [50, "Title must have 50 characters or fewer."],
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
  borrowers: {
    // Each tuple represents the borrower name and the amount they owe in pence.
    type: [[mongoose.Schema.Types.Mixed]],
    required: true,
    validate: {
      validator: isValidBorrowers,
      message: "Borrowers must contain username and positive pence tuples.",
    },
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "Amount must be greater than 0 pence."],
    max: [100000000, "Amount must be less than 100000000 pence."],
  },
});

module.exports = mongoose.model("expense", expenseSchema);
