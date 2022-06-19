// Sets up the Mongoose connection.
let mongoose = require("mongoose");
// Remember to replace <password> with the actual credential locally.
let devUrl =
  "mongodb+srv://admin:<password>@fairsplit.fjvgxmg.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(devUrl, {
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
