const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const usersRouter = require("./routes/users.js");
const expensesRouter = require("./routes/expenses.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(usersRouter);
app.use(expensesRouter);

// IMPORTANT: Create .env file with password
const password = process.env.PASSWORD;
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

// Sets up the port to listen on.
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at port ${port}.`);
});
