const debtModel = require("../models/debt");

// Gets a list of all debts.
exports.getDebts = async (_, response) => {
  const debt = await debtModel.find({});

  try {
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Gets a debt by ID.
exports.getDebtById = async (request, response) => {
  const debt = await debtModel.findById(request.params.id);

  try {
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
    await debtModel.findOneAndUpdate(
      {
        from: request.body.from,
        to: request.body.to,
      },
      {
        $inc: { amount: request.body.amount },
      }
    );

    try {
      response.send("Debt updated successfully.");
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    // Create a new debt between the two users.
    const debt = await debtModel.create({
      from: request.body.from,
      to: request.body.to,
      amount: request.body.amount,
    });

    try {
      response.json(debt);
    } catch (error) {
      response.status(500).send(error);
    }
  }
};

exports.addDebt = async (request, response) => {};
