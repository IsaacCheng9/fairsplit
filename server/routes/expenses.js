const express = require("express");
const expenseController = require("../controllers/expense_controller");
const { asyncHandler, errorHandler } = require("../middleware/errors");
const { validateExpense } = require("../middleware/validation");
const app = express();

// Get all expenses in the group.
app.get("/expenses", asyncHandler(expenseController.getExpenses));

// Add an expense.
app.post(
  "/expenses",
  validateExpense,
  asyncHandler(expenseController.addExpense),
);

// Temporary route for adding settlement as expense.
app.post(
  "/expenses/settlement",
  validateExpense,
  asyncHandler(expenseController.addSettlement),
);

app.use(errorHandler);

module.exports = app;
