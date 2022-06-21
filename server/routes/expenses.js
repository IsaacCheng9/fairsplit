const express = require("express");
const expenseModel = require("../models/expense");

const app = express();

// Gets all expenses in the group.
// app.get("/expenses", async (_, response) => {
//   const expenses = await expenseModel.find();

//   try {
//     response.json(expenses);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// Gets an expense by ID.
// app.get("/expenses/:id", async (request, response) => {
//   const expenses = await expenseModel.findById(request.params.id);

//   try {
//     response.json(expenses);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// Adds an expense.
app.post("/expenses/add", async (request, response) => {
  const expense = await expenseModel.create({
    title: request.body.title,
    author: request.body.author,
    lender: request.body.lender,
    borrowers: request.body.borrowers,
  });

  try {
    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Updates an expense by ID.
// app.put("/expenses/update/:id", async (request, response) => {
//   const expenses = await expenseModel.findByIdAndUpdate(request.params.id, {
//     title: request.body.title,
//     lender: request.body.lender,
//     borrowers: request.body.borrowers,
//   });

//   try {
//     response.json(expenses);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// Deletes an expense by ID.
// app.delete("/expenses/delete/:id", async (request, response) => {
//   const expenses = await expenseModel.findByIdAndDelete(request.params.id);

//   try {
//     response.json(expenses);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

module.exports = app;
