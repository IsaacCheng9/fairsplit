const express = require("express");
const Router = require("./routes");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Remember to replace this value with the actual password locally.
const password = "<password>";
let devUrl = `mongodb+srv://admin:${password}@fairsplit.fjvgxmg.mongodb.net/?retryWrites=true&w=majority`;
var mongoDB = process.env.MONGODB_URI || devUrl;
// Sets up the Mongoose connection.
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;

// Binds the connection to an error event to get notification of connection
// errors.
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// Displays a success message when the connection is successfully made.
db.once("open", function () {
  console.log("Connected successfully.");
});
