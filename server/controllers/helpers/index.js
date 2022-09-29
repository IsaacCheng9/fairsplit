const Heap = require("heap");
const debtModel = require("../../models/debt");
const userDebtModel = require("../../models/user_debt");
const optimisedDebtModel = require("../../models/optimised_debt");

// Add a debt, including processing of the reverse debt.
exports.processNewDebt = async function (from, to, amount) {
  // The borrower owes more, so the lender owes less.
  await userDebtModel.findOneAndUpdate(
    { username: from },
    { $inc: { netDebt: amount } }
  );
  await userDebtModel.findOneAndUpdate(
    { username: to },
    { $inc: { netDebt: -amount } }
  );

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
      await debtModel.create({
        from: from,
        to: to,
        amount: debtAmount,
      });
      return `Debt from '${from}' to '${to}' was created successfully.`;
    }
  }
};

// Simplify debts to minimise the total number of transactions required to get
// to a balanced state using a greedy heuristic algorithm.
exports.simplifyDebts = async function () {
  // Create min-heaps for debt and credit so we can automatically find the
  // smallest amounts and who they belong to in O(n log n) time.
  let minHeapDebt = new Heap(function (a, b) {
    return a.amount - b.amount;
  });
  let minHeapCredit = new Heap(function (a, b) {
    return a.amount - b.amount;
  });

  // Add users to a min-heap for debt and credit.
  for await (const userDebt of userDebtModel.find({})) {
    if (userDebt.netDebt > 0) {
      minHeapDebt.push({
        username: userDebt.username,
        amount: userDebt.netDebt,
      });
    } else if (userDebt.netDebt < 0) {
      minHeapCredit.push({
        username: userDebt.username,
        amount: -userDebt.netDebt,
      });
    }
  }

  // Create a new set of optimised debts to store the simplified debts.
  optimisedDebtModel.deleteMany({});
  // Create transactions until the min-heaps are empty to reach a zero-state.
  while (!minHeapDebt.empty() && !minHeapCredit.empty()) {
    const smallestDebt = minHeapDebt.pop();
    const smallestCredit = minHeapCredit.pop();
    // Create a new optimised debt.
    transactionAmount = Math.min(smallestDebt.amount, smallestCredit.amount);
    optimisedDebtModel.create({
      from: smallestDebt.username,
      to: smallestCredit.username,
      amount: transactionAmount,
    });

    // If the optimised debt only partially removed a debt/credit, then push
    // the remainder back to the min-heap.
    if (transactionAmount < smallestDebt.amount) {
      minHeapDebt.push({
        username: smallestDebt.username,
        amount: smallestDebt.amount - transactionAmount,
      });
    }
    if (transactionAmount < smallestCredit.amount) {
      minHeapCredit.push({
        username: smallestCredit.username,
        amount: smallestCredit.amount - transactionAmount,
      });
    }
  }
};
