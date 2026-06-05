function parsePort(port) {
  const parsedPort = Number(port);
  if (!Number.isInteger(parsedPort) || parsedPort < 1) {
    throw new Error("PORT must be a positive integer.");
  }
  return parsedPort;
}

function getServerConfig(env = process.env) {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set.");
  }

  return {
    corsOrigin: env.CORS_ORIGIN || "http://localhost:3000",
    mongoDB: env.MONGODB_URI,
    port: parsePort(env.PORT || "3001"),
  };
}

module.exports = { getServerConfig, parsePort };
