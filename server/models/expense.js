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
  borrowers: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("expense", expenseSchema);
