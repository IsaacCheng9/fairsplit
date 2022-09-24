const helpers = require("./helpers/index");
const expenseModel = require("../models/expense");

// Add an expense and create the related debts between lender and borrowers.
exports.addExpense = async (request, response) => {
  // Check that the sum of amounts owed matches the total expense amount.
  let currentSum = 0;
  for (borrower of request.body.borrowers) {
    if (borrower[1] <= 0) {
      return response.status(400).json({
        error: "The amount owed must be a positive number.",
      });
    } else {
      currentSum += borrower[1];
    }
  }
  if (currentSum !== request.body.amount) {
    return response.status(400).json({
      error: "The sum of amounts owed must equal the total expense amount.",
    });
  }

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

  // Recalculate debts to minimise the number of transactions, as this
  // settlement may have changed the optimal strategy.
  helpers.simplifyDebts();
  response.status(201).json(expense);
};

// Get all expenses.
exports.getExpenses = async (_, response) => {
  const expenses = await expenseModel.find({});
  response.json(expenses);
};

// Temporary controller to add settlement as expense.
exports.addSettlement = async (request, response) => {
  // Keep a record of the settlement for the history.
  const settlement = await expenseModel.create({
    title: request.body.title,
    author: request.body.author,
    lender: request.body.lender,
    borrowers: request.body.borrowers,
    amount: request.body.amount,
  });
  response.status(201).json(settlement);
};
