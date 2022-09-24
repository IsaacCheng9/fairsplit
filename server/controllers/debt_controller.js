const debtModel = require("../models/debt");
const optimisedDebtModel = require("../models/optimised_debt");
const userDebtModel = require("../models/user_debt");
const helpers = require("./helpers/index");

// Get a list of all debts.
exports.getDebts = async (_, response) => {
  const debt = await debtModel.find({});
  response.json(debt);
};

// Get a list of all optimised debts.
exports.getOptimisedDebts = async (_, response) => {
  const optimisedDebt = await optimisedDebtModel.find({});
  response.json(optimisedDebt);
};

// Get a debt by lender and borrower.
exports.getDebtBetweenUsers = async (request, response) => {
  const debt = await debtModel.findOne({
    from: request.params.from,
    to: request.params.to,
  });
  response.json(debt);
};

// Add a debt between two users.
exports.addDebt = async (request, response) => {
  let message = await helpers.processNewDebt(
    request.body.from,
    request.body.to,
    request.body.amount
  );
  response.status(201).send(message);
};

// Settle a debt by ID.
exports.settleDebt = async (request, response) => {
  // Search for a debt by swapping the from and to fields, as a settlement is
  // effectively a reverse debt.
  const existingDebt = await debtModel.findOne({
    from: request.body.to,
    to: request.body.from,
  });

  if (request.body.amount <= 0) {
    response.status(400).send("Amount must be greater than £0.");
  } else if (existingDebt && existingDebt.amount > request.body.amount) {
    // If the existing debt is greater than the amount to be settled, then
    // reduce the debt.
    await debtModel.findOneAndUpdate(
      {
        from: request.body.to,
        to: request.body.from,
      },
      {
        $inc: { amount: -request.body.amount },
      }
    );
    // The borrower owes less, so the lender owes more.
    await userDebtModel.findOneAndUpdate(
      { username: request.body.from },
      { $inc: { netDebt: -request.body.amount } }
    );
    await userDebtModel.findOneAndUpdate(
      { username: request.body.to },
      { $inc: { netDebt: request.body.amount } }
    );
    // Recalculate debts to minimise the number of transactions, as this
    // settlement may have changed the optimal strategy.
    helpers.simplifyDebts();
    response.send(
      `Debt from '${request.body.from}' to '${request.body.to}' partially\
        settled and reduced successfully.`
    );
  } else if (existingDebt && existingDebt.amount === request.body.amount) {
    // If the existing debt is equal to the amount to be settled, then delete
    // the debt.
    await debtModel.findOneAndDelete({
      from: request.body.to,
      to: request.body.from,
    });
    // The borrower owes less, so the lender owes more.
    await userDebtModel.findOneAndUpdate(
      { username: request.body.from },
      { $inc: { netDebt: -request.body.amount } }
    );
    await userDebtModel.findOneAndUpdate(
      { username: request.body.to },
      { $inc: { netDebt: request.body.amount } }
    );
    // Recalculate debts to minimise the number of transactions, as this
    // settlement may have changed the optimal strategy.
    helpers.simplifyDebts();
    response.send(
      `Debt from '${request.body.from}' to '${request.body.to}' fully\
        settled and deleted successfully.`
    );
  } else {
    response
      .status(400)
      .send("You cannot settle more than the amount of the debt.");
  }
};

// Delete a debt between a lender and borrower.
exports.deleteDebtBetweenUsers = async (request, response) => {
  await debtModel.deleteOne({
    from: request.params.from,
    to: request.params.to,
  });
  // Now that we've deleted the debt, there may be a better way of allocating
  // the debt, so recalculate debts to minimise the number of transactions.
  helpers.simplifyDebts();
  response.send(
    `Debt from '${request.params.from}' to '${request.params.to}' deleted\
      successfully.`
  );
};
