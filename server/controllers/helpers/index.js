const debtModel = require("../../models/debt");

// Create a new debt between the two users.
exports.createNewDebt = function (from, to, amount) {
  try {
    const debt = debtModel.create({
      from: from,
      to: to,
      amount: amount,
    });
    response.json(debt);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Update an existing debt.
exports.updateDebt = function (from, to, amount) {
  try {
    debtModel.findOneAndUpdate(
      {
        from: from,
        to: to,
      },
      {
        $inc: { amount: amount },
      }
    );
    response.send("Debt updated successfully.");
  } catch (error) {
    response.status(500).send(error);
  }
};
