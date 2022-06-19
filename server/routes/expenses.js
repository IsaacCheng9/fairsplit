const express = require("express");
const expenseModel = require("../models/expense");

const app = express();
// Converts the ID from string to ObjectId for the _id.
const objectId = require("mongodb").ObjectId;

// Gets all expenses in the group.
app.get("/expenses", async (_, response) => {
  const expenses = await expenseModel.find();

  try {
    response.json(expenses);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Gets an expense by ID.
app.get("/expenses/:id", async (request, response) => {
  const expenses = await expenseModel.findById(request.params.id);

  try {
    response.json(expenses);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Deletes an expense by ID.
app.post("/expenses/delete/:id", async (request, response) => {
  const expenses = await expenseModel.findByIdAndDelete(request.params.id);

  try {
    response.json(expenses);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
