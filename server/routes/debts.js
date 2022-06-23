const express = require("express");
const debtModel = require("../models/debt");
const app = express();

// Gets a list of all debts.
app.get("/debts", async (_, response) => {
  const debt = await debtModel.find({});

  try {
    response.json(debt);
  } catch (error) {
    {
      response.status(500).send(error);
    }
  }
});

// Gets a debt by ID.
app.get("/debts/:id", async (request, response) => {
  const debt = await debtModel.findById(request.params.id);

  try {
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Creates a new debt between two users.
app.post("/debts/add", async (request, response) => {
  const debt = await debtModel.create({
    from: request.body.from,
    to: request.body.to,
    amount: request.body.amount,
  });

  try {
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Updates a debt by ID.
// app.put("/debts/update/:id", async (request, response) => {});

// Deletes a debt by ID.
// app.delete("/debts/delete/:id", async (request, response) => {});

module.exports = app;
