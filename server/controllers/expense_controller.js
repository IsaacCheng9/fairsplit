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
      // Check whether the debt exists between two users so that we can either
      // create a new debt, or update an existing debt.
      const debtExists = await debtModel.exists({
        from: borrower,
        to: request.body.lender,
      });

      if (debtExists) {
        // Update the debt between the lender and borrower.
        helpers.updateDebt(borrower, request.body.lender, sharedExpense);
      } else {
        // Create a new debt between the lender and borrower.
        helpers.createDebt(borrower, request.body.lender, sharedExpense);
      }
    }

    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
};
