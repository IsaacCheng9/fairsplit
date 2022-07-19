const debtModel = require("../../models/debt");

// Create a new debt between the two users.
exports.createNewDebt = function (from, to, amount) {
  const debt = debtModel.create({
    from: from,
    to: to,
    amount: amount,
  });
};

// Update an existing debt.
exports.updateDebt = function (from, to, amount) {
  debtModel.findOneAndUpdate(
    {
      from: from,
      to: to,
    },
    {
      $inc: { amount: amount },
    }
  );
};
