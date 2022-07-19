const debtModel = require("../../models/debt");

// Create a new debt between the two users.
exports.createNewDebt = function(from, to, amount) {
  try {
    const debt = await debtModel.create({
      from: from,
      to: to,
      amount: amount
    });
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};
