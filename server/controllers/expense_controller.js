const expenseModel = require("../models/expense");

// Adds an expense.
exports.addExpense = async (request, response) => {
  const expense = await expenseModel.create({
    title: request.body.title,
    author: request.body.author,
    lender: request.body.lender,
    borrowers: request.body.borrowers,
    amount: request.body.amount,
  });

  try {
    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
};
