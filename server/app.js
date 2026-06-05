const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users.js");
const expensesRouter = require("./routes/expenses.js");
const debtsRouter = require("./routes/debts.js");
const { errorHandler } = require("./middleware/errors");

function createApp({ corsOrigin = "http://localhost:3000" } = {}) {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: corsOrigin,
    }),
  );
  app.use(usersRouter);
  app.use(expensesRouter);
  app.use(debtsRouter);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
