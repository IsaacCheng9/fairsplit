const express = require("express");
const debtController = require("../controllers/debt_controller");
const { asyncHandler, errorHandler } = require("../middleware/errors");
const { validateDebt } = require("../middleware/validation");
const app = express();

// Get a list of all debts.
app.get("/debts", asyncHandler(debtController.getDebts));

// Get a list of all optimised debts.
app.get("/optimisedDebts", asyncHandler(debtController.getOptimisedDebts));

// Get a debt by lender and borrower.
app.get("/debts/:from/:to", asyncHandler(debtController.getDebtBetweenUsers));

// Add a new debt between two users.
app.post("/debts/add", validateDebt, asyncHandler(debtController.addDebt));

// Settle a debt between two users.
app.post(
  "/debts/settle",
  validateDebt,
  asyncHandler(debtController.settleDebt),
);

// Delete a debt between a lender and borrower.
app.delete(
  "/debts/:from/:to",
  asyncHandler(debtController.deleteDebtBetweenUsers),
);

app.use(errorHandler);

module.exports = app;
