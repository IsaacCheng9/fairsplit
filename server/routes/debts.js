const express = require("express");
const debtController = require("../controllers/debt_controller");
const app = express();

// Gets a list of all debts.
app.get("/debts", debtController.getDebts);

// Gets a list of all optimised debts.
app.get("/optimisedDebts", debtController.getOptimisedDebts);

// Gets a debt by ID.
app.get("/debts/:from/:to", debtController.getDebtBetweenUsers);

// Adds a new debt between two users.
app.post("/debts/add", debtController.addDebt);

// Settles a debt between two users.
app.post("/debts/settle", debtController.settleDebt);

module.exports = app;
