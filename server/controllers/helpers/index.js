const debtModel = require("../../models/debt");

// Create a new debt between the two users.
exports.createDebt = async function (from, to, amount) {
  debtModel.create({
    from: from,
    to: to,
    amount: amount,
  });
};

// Update an existing debt.
exports.updateDebt = async function (from, to, amount) {
  await debtModel.findOneAndUpdate(
    {
      from: from,
      to: to,
    },
    {
      $inc: { amount: amount },
    }
  );
};
