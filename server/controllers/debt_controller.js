const debtModel = require("../models/debt");
const helpers = require("./helpers/index");

// Gets a list of all debts.
exports.getDebts = async (_, response) => {
  try {
    const debt = await debtModel.find({});
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Gets a debt by ID.
exports.getDebtById = async (request, response) => {
  try {
    const debt = await debtModel.findById(request.params.id);
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Adds a debt between two users.
exports.addDebt = async (request, response) => {
  // Check whether the debt exists the other way around, as this new debt may
  // cancel out the reverse debt.
  const reverseDebt = await debtModel.findOne({
    from: request.body.to,
    to: request.body.from,
  });
  // Keep track of the debt amount to add, as this may change if there is a
  // reverse debt to be settled.
  let debtAmount = request.body.amount;
  // If the reverse debt is greater than the new debt, then reduce the reverse
  // debt and avoid adding a new debt.
  if (reverseDebt && reverseDebt.amount > request.body.amount) {
    await debtModel.findOneAndUpdate(
      {
        from: request.body.to,
        to: request.body.from,
      },
      {
        $inc: { amount: -request.body.amount },
      }
    );
    debtAmount = 0;
  } else if (reverseDebt && reverseDebt.amount <= request.body.amount) {
    // If the reverse debt is less than or equal to the new debt, then delete
    // the reverse debt and update the new debt amount.
    debtAmount -= reverseDebt.amount;
    await debtModel.findOneAndDelete({
      from: request.body.to,
      to: request.body.from,
    });
  }

  // If the reverse debt has cancelled out the new debt, then don't add a new
  // debt. Otherwise, proceed to add the new debt.
  if (debtAmount === 0) {
    response.send(
      `The new debt was used to cancel out a reverse debt, so a new debt from
      '${request.body.from}' to '${request.body.to}' was not added.`
    );
  } else {
    // Check whether the debt exists between two users so that we can either
    // create a new debt, or update an existing debt.
    const debtExists = await debtModel.exists({
      from: request.body.from,
      to: request.body.to,
    });

    try {
      if (debtExists) {
        // Update the debt between the lender and borrower.
        helpers.updateDebt(request.body.from, request.body.to, debtAmount);
        response.send("Debt updated successfully.");
      } else {
        // Create a new debt between the lender and borrower.
        helpers.createDebt(request.body.from, request.body.to, debtAmount);
        response.send("Debt created successfully.");
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
};

// Settles a debt by ID.
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
      response.send("Debt partially settled and reduced successfully.");
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
      response.send("Debt fully settled and deleted successfully.");
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    response
      .status(400)
      .send("You cannot settle more than the amount of the debt.");
  }
};
