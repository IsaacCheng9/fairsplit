const express = require("express");
const debtController = require("../controllers/debt_controller");
const app = express();

// Get a list of all debts.
app.get("/debts", debtController.getDebts);

// Get a list of all optimised debts.
app.get("/optimisedDebts", debtController.getOptimisedDebts);

// Get a debt by lender and borrower.
app.get("/debts/:from/:to", debtController.getDebtBetweenUsers);

// Add a new debt between two users.
app.post("/debts/add", debtController.addDebt);

// Settle a debt between two users.
app.post("/debts/settle", debtController.settleDebt);

// Delete a debt between a lender and borrower.
app.delete("/debts/:from/:to", debtController.deleteDebtBetweenUsers);

module.exports = app;
