const helpers = require("./helpers/index");
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
    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }

  // Check whether the debt exists between two users so that we can either
  // create a new debt, or update an existing debt.
  const debtExists = await debtModel.exists({
    from: request.body.from,
    to: request.body.to,
  });

  if (debtExists) {
    // Update the debt between the lender and borrower.
    try {
      helpers.updateDebt(
        request.body.lender,
        request.body.borrowers,
        request.body.amount
      );
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    // Create a new debt between the lender and borrower.
    try {
      helpers.createDebt(
        request.body.lender,
        request.body.borrowers,
        request.body.amount
      );
    } catch (error) {
      response.status(500).send(error);
    }
  }
};
