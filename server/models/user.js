const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
});

module.exports = User = mongoose.model("user", UserSchema);
