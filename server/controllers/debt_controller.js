const debtModel = require("../models/debt");
const optimisedDebtModel = require("../models/optimised_debt");
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
  const message = await helpers.withTransaction(async (session) => {
    const message = await helpers.processNewDebt(
      request.body.from,
      request.body.to,
      request.body.amount,
      session,
    );
    await helpers.simplifyDebts(session);
    return message;
  });

  response.status(201).send(message);
};

// Settle a debt by ID.
exports.settleDebt = async (request, response) => {
  const result = await helpers.withTransaction(async (session) => {
    // Search for a debt by swapping the from and to fields, as a settlement is
    // effectively a reverse debt.
    const existingDebt = await debtModel
      .findOne({
        from: request.body.to,
        to: request.body.from,
      })
      .session(session);

    if (!existingDebt || existingDebt.amount < request.body.amount) {
      return {
        status: 400,
        message: "You cannot settle more than the amount of the debt.",
      };
    }

    // If the existing debt is equal to the amount to be settled, then delete
    // the debt. Otherwise, reduce it.
    if (existingDebt.amount === request.body.amount) {
      await debtModel
        .findOneAndDelete({
          from: request.body.to,
          to: request.body.from,
        })
        .session(session);
    } else {
      await debtModel.findOneAndUpdate(
        {
          from: request.body.to,
          to: request.body.from,
        },
        {
          $inc: { amount: -request.body.amount },
        },
        { session },
      );
    }

    // The borrower owes less, so the lender owes more.
    await helpers.adjustUserDebt(
      request.body.from,
      -request.body.amount,
      session,
    );
    await helpers.adjustUserDebt(request.body.to, request.body.amount, session);

    // Recalculate debts to minimise the number of transactions, as this
    // settlement may have changed the optimal strategy.
    await helpers.simplifyDebts(session);

    const settlementType =
      existingDebt.amount === request.body.amount ? "fully" : "partially";
    const settlementAction =
      existingDebt.amount === request.body.amount ? "deleted" : "reduced";

    return {
      status: 200,
      message: `Debt from '${request.body.from}' to '${request.body.to}' ${settlementType}\
        settled and ${settlementAction} successfully.`,
    };
  });

  response.status(result.status).send(result.message);
};

// Delete a debt between a lender and borrower.
exports.deleteDebtBetweenUsers = async (request, response) => {
  const result = await helpers.withTransaction(async (session) => {
    // Find the debt first so we know the amount to adjust balances.
    const debt = await debtModel
      .findOne({
        from: request.params.from,
        to: request.params.to,
      })
      .session(session);

    if (!debt) {
      return {
        status: 404,
        message: "Debt not found.",
      };
    }

    // Delete the debt.
    await debtModel
      .deleteOne({
        from: request.params.from,
        to: request.params.to,
      })
      .session(session);

    // Update userDebt balances: the borrower owes less, the lender is owed less.
    await helpers.adjustUserDebt(request.params.from, -debt.amount, session);
    await helpers.adjustUserDebt(request.params.to, debt.amount, session);

    // Recalculate optimised debts.
    await helpers.simplifyDebts(session);
    return {
      status: 200,
      message: `Debt from '${request.params.from}' to '${request.params.to}' deleted\
        successfully.`,
    };
  });

  response.status(result.status).send(result.message);
};
