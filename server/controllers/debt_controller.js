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

// Creates a new debt between two users.
exports.createNewDebt = async (request, response) => {
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
};

exports.addDebt = async (request, response) => {};
