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

    // TODO: Loop through so that it works for all borrowers instead of just one.
    // Check whether the debt exists between two users so that we can either
    // create a new debt, or update an existing debt.
    const debtExists = await debtModel.exists({
      from: request.body.borrowers[0],
      to: request.body.lender,
    });

    if (debtExists) {
      // Update the debt between the lender and borrower.
      helpers.updateDebt(
        request.body.borrowers[0],
        request.body.lender,
        request.body.amount
      );
    } else {
      // Create a new debt between the lender and borrower.
      helpers.createDebt(
        request.body.borrowers[0],
        request.body.lender,
        request.body.amount
      );
    }

    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
};
