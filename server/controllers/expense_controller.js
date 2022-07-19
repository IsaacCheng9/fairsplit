const expenseModel = require("../models/expense");

// Adds an expense.
exports.addExpense = async (request, response) => {
  try {
    const expense = await expenseModel.create({
      title: request.body.title,
      author: request.body.author,
      lender: request.body.lender,
      borrowers: request.body.borrowers,
      amount: request.body.amount,
    });
    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
};
