const debtModel = require("../../models/debt");

// Add a debt, including processing of the reverse debt.
exports.processNewDebt = async function (from, to, amount) {
  // Check whether the debt exists the other way around, as this new debt may
  // cancel out the reverse debt.
  const reverseDebt = await debtModel.findOne({
    from: to,
    to: from,
  });
  // Keep track of the debt amount to add, as this may change if there is a
  // reverse debt to be settled.
  let debtAmount = amount;
  // If the reverse debt is greater than the new debt, then reduce the reverse
  // debt and avoid adding a new debt.
  if (reverseDebt && reverseDebt.amount > amount) {
    await debtModel.findOneAndUpdate(
      {
        from: to,
        to: from,
      },
      {
        $inc: { amount: -amount },
      }
    );
    debtAmount = 0;
  } else if (reverseDebt && reverseDebt.amount <= amount) {
    // If the reverse debt is less than or equal to the new debt, then delete
    // the reverse debt and update the new debt amount.
    debtAmount -= reverseDebt.amount;
    await debtModel.findOneAndDelete({
      from: to,
      to: from,
    });
  }

  // If the reverse debt has cancelled out the new debt, then don't add a new
  // debt. Otherwise, proceed to add the new debt.
  if (debtAmount === 0) {
    return `The new debt was used to cancel out a reverse debt, so a new debt\
    from '${from}' to '${to}' was not added.`;
  } else {
    // Check whether the debt exists between two users so that we can either
    // create a new debt, or update an existing debt.
    const debtExists = await debtModel.exists({
      from: from,
      to: to,
    });

    if (debtExists) {
      // Update the debt between the lender and borrower.
      await debtModel.findOneAndUpdate(
        {
          from: from,
          to: to,
        },
        {
          $inc: { amount: debtAmount },
        }
      );
      return `Debt from '${from}' to '${to}' was updated successfully.`;
    } else {
      // Create a new debt between the lender and borrower.
      debtModel.create({
        from: from,
        to: to,
        amount: debtAmount,
      });
      return `Debt from '${from}' to '${to}' was created successfully.`;
    }
  }
};
