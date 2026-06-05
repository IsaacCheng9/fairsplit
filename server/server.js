const mongoose = require("mongoose");
require("dotenv").config();

const { createApp } = require("./app");
const { getServerConfig } = require("./config");

async function startServer() {
  const config = getServerConfig();
  const app = createApp({ corsOrigin: config.corsOrigin });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:"),
  );
  mongoose.connection.once("open", () => {
    console.log("Connected successfully.");
  });

  await mongoose.connect(config.mongoDB);

  return app.listen(config.port, () => {
    console.log(`Server is running at port ${config.port}.`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

module.exports = { startServer };
