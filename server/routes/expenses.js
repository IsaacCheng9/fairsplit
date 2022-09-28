const express = require("express");
const expenseController = require("../controllers/expense_controller");
const app = express();

// Get all expenses in the group.
app.get("/expenses", expenseController.getExpenses);

// Add an expense.
app.post("/expenses", expenseController.addExpense);

// Temporary route for adding settlement as expense.
app.post("/expenses/settlement", expenseController.addSettlement);

module.exports = app;
