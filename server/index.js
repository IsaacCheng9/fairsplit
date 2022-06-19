const express = require("express");
const app = express();
require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(require("./routes/users"));

// Gets the driver connection.
const dbo = require("./db/conn");

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  // Sets up a database connection when the server starts.
  dbo.connectToServer(function (err) {
    if (err) {
      console.error(err);
    }
  });
  console.log(`Server is running on ${PORT}`);
});