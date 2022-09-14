const express = require("express");
const expenseController = require("../controllers/expense_controller");
const app = express();

// Gets all expenses in the group.
app.get("/expenses", expenseController.getExpenses);

// Adds an expense.
app.post("/expenses/add", expenseController.addExpense);

// Temporary route for adding settlement as expense.
app.post("/expenses/addSettlement", expenseController.addSettlement);

// Updates an expense by ID.
// app.put("/expenses/update/:id", expenseController.updateExpenseById);

// Deletes an expense by ID.
// app.delete("/expenses/delete/:id", expenseController.deleteExpense);

module.exports = app;
