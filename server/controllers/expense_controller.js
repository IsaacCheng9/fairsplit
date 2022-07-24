const helpers = require("./helpers/index");
const debtModel = require("../models/debt");
const expenseModel = require("../models/expense");

// Adds an expense.
exports.addExpense = async (request, response) => {
  // Keep a record of the expense for the history.
  try {
    const expense = await expenseModel.create({
      title: request.body.title,
      author: request.body.author,
      lender: request.body.lender,
      borrowers: request.body.borrowers,
      amount: request.body.amount,
    });

    // TODO: Add support for an unequal split of the expense between borrowers.
    // Split the expense between the borrowers – assume an equal split for now.
    sharedExpense = request.body.amount / request.body.borrowers.length;

    // Loop through each borrower and create/update debts accordingly.
    for (borrower of request.body.borrowers) {
      helpers.processNewDebt(borrower, request.body.lender, sharedExpense);
    }

    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Get all expenses.
exports.getExpenses = async (_, response) => {
  const expenses = await expenseModel.find({});

  try {
    response.json(expenses);
  } catch (error) {
    response.status(500).send(error);
  }
};
