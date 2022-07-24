const debtModel = require("../models/debt");
const helpers = require("./helpers/index");

// Get a list of all debts.
exports.getDebts = async (_, response) => {
  try {
    const debt = await debtModel.find({});
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Get a debt by ID.
exports.getDebtById = async (request, response) => {
  try {
    const debt = await debtModel.findById(request.params.id);
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Add a debt between two users.
exports.addDebt = async (request, response) => {
  message = helpers.processNewDebt(
    request.body.from,
    request.body.to,
    request.body.amount
  );
  response.send(message);
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
    try {
      await debtModel.findOneAndUpdate(
        {
          from: request.body.to,
          to: request.body.from,
        },
        {
          $inc: { amount: -request.body.amount },
        }
      );
      response.send(
        `Debt from '${request.body.from}' to '${request.body.to}' partially\
        settled and reduced successfully.`
      );
    } catch (error) {
      response.status(500).send(error);
    }
  } else if (existingDebt && existingDebt.amount === request.body.amount) {
    try {
      // If the existing debt is equal to the amount to be settled, then delete
      // the debt.
      await debtModel.findOneAndDelete({
        from: request.body.to,
        to: request.body.from,
      });
      response.send(
        `Debt from '${request.body.from}' to '${request.body.to}' fully\
        settled and deleted successfully.`
      );
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    response
      .status(400)
      .send("You cannot settle more than the amount of the debt.");
  }
};
