const helpers = require("./helpers/index");
const expenseModel = require("../models/expense");

// Adds an expense.
exports.addExpense = async (request, response) => {
  // Keep a record of the expense for the history.
  const expense = await expenseModel.create({
    title: request.body.title,
    author: request.body.author,
    lender: request.body.lender,
    borrowers: request.body.borrowers,
    amount: request.body.amount,
  });

  // Loop through each borrower and create/update debts accordingly.
  for (borrowerInfo of request.body.borrowers) {
    const borrower = borrowerInfo[0];
    // The amount they owe must be handled before this to account for different
    // methods of splitting the expense (e.g. specific amounts, by percentage,
    // etc.).
    const owedAmount = borrowerInfo[1];
    await helpers.processNewDebt(borrower, request.body.lender, owedAmount);
  }

  response.json(expense);
};

// Get all expenses.
exports.getExpenses = async (_, response) => {
  const expenses = await expenseModel.find({});
  response.json(expenses);
};
