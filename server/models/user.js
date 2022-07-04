const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  firstName: {
    type: String,
    max: [30, "First name must have fewer than 30 characters."],
    required: true,
  },
  lastName: {
    type: String,
    max: [30, "Last name must have fewer than 30 characters."],
    required: true,
  },
  creationDatetime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
