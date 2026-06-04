const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    maxlength: [30, "Username must be within 30 characters."],
    required: true,
  },
  firstName: {
    type: String,
    maxlength: [30, "First name must have 30 characters or fewer."],
    required: true,
  },
  lastName: {
    type: String,
    maxlength: [30, "Last name must have 30 characters or fewer."],
    required: true,
  },
  creationDatetime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
