const debtModel = require("../models/debt");

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
  // Check whether the debt exists between two users so that we can either
  // create a new debt, or update an existing debt.
  const debtExists = await debtModel.exists({
    from: request.body.from,
    to: request.body.to,
  });

  if (debtExists) {
    // Update an existing debt.
    try {
      await debtModel.findOneAndUpdate(
        {
          from: request.body.from,
          to: request.body.to,
        },
        {
          $inc: { amount: request.body.amount },
        }
      );
      response.send("Debt updated successfully.");
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    // Create a new debt between the two users.
    try {
      const debt = await debtModel.create({
        from: request.body.from,
        to: request.body.to,
        amount: request.body.amount,
      });
      response.json(debt);
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
