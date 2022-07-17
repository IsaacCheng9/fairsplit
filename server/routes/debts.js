const express = require("express");
const debtController = require("../controllers/debt_controller");
const app = express();

// Gets a list of all debts.
app.get("/debts", debtController.getDebts);

// Gets a debt by ID.
app.get("/debts/:id", debtController.getDebtById);

// Adds a new debt between two users.
app.post("/debts/add", debtController.createNewDebt);

// Deletes a debt by ID.
// app.delete("/debts/delete/:id", async (request, response) => {});

module.exports = app;
