const mongoose = require("mongoose");
const Heap = require("heap");
const debtModel = require("../../models/debt");
const userDebtModel = require("../../models/user_debt");
const optimisedDebtModel = require("../../models/optimised_debt");

const MAX_TRANSACTION_ATTEMPTS = 5;

function getSessionOptions(session) {
  return session ? { session } : {};
}

function withSession(query, session) {
  return session ? query.session(session) : query;
}

function isTransientTransactionError(error) {
  return (
    typeof error.hasErrorLabel === "function" &&
    error.hasErrorLabel("TransientTransactionError")
  );
}

exports.withTransaction = async function (work) {
  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt++) {
    try {
      return await mongoose.connection.transaction(work);
    } catch (error) {
      if (
        attempt === MAX_TRANSACTION_ATTEMPTS ||
        !isTransientTransactionError(error)
      ) {
        throw error;
      }
    }
  }
};

exports.adjustUserDebt = async function (username, amount, session) {
  await userDebtModel.findOneAndUpdate(
    { username },
    { $inc: { netDebt: amount } },
    {
      new: true,
      runValidators: true,
      upsert: true,
      ...getSessionOptions(session),
    },
  );
};

async function incrementDebt(from, to, amount, session) {
  await debtModel.findOneAndUpdate(
    { from, to },
    { $inc: { amount } },
    {
      new: true,
      runValidators: true,
      upsert: true,
      ...getSessionOptions(session),
    },
  );
}

// Add a debt, including processing of the reverse debt.
exports.processNewDebt = async function (from, to, amount, session = null) {
  // The borrower owes more, so the lender owes less.
  await exports.adjustUserDebt(from, amount, session);
  await exports.adjustUserDebt(to, -amount, session);

  // Check whether the debt exists the other way around, as this new debt may
  // cancel out the reverse debt.
  const reverseDebt = await withSession(
    debtModel.findOne({
      from: to,
      to: from,
    }),
    session,
  );
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
      },
      getSessionOptions(session),
    );
    debtAmount = 0;
  } else if (reverseDebt && reverseDebt.amount <= amount) {
    // If the reverse debt is less than or equal to the new debt, then delete
    // the reverse debt and update the new debt amount.
    debtAmount -= reverseDebt.amount;
    await withSession(
      debtModel.findOneAndDelete({
        from: to,
        to: from,
      }),
      session,
    );
  }

  // If the reverse debt has cancelled out the new debt, then don't add a new
  // debt. Otherwise, proceed to add the new debt.
  if (debtAmount === 0) {
    return `The new debt was used to cancel out a reverse debt, so a new debt\
    from '${from}' to '${to}' was not added.`;
  } else {
    await incrementDebt(from, to, debtAmount, session);
    return `Debt from '${from}' to '${to}' was updated successfully.`;
  }
};

// Simplify debts to minimise the total number of transactions required to get
// to a balanced state using a greedy heuristic algorithm.
exports.simplifyDebts = async function (session = null) {
  // Create min-heaps for debt and credit so we can automatically find the
  // smallest amounts and who they belong to in O(n log n) time.
  let minHeapDebt = new Heap(function (a, b) {
    return a.amount - b.amount;
  });
  let minHeapCredit = new Heap(function (a, b) {
    return a.amount - b.amount;
  });

  // Add users to a min-heap for debt and credit.
  for await (const userDebt of withSession(userDebtModel.find({}), session)) {
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

  const optimisedDebts = [];

  // Create transactions until the min-heaps are empty to reach a zero-state.
  while (!minHeapDebt.empty() && !minHeapCredit.empty()) {
    const smallestDebt = minHeapDebt.pop();
    const smallestCredit = minHeapCredit.pop();
    // Create a new optimised debt.
    const transactionAmount = Math.min(
      smallestDebt.amount,
      smallestCredit.amount,
    );
    optimisedDebts.push({
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

  const operations = [
    {
      deleteMany: {
        filter: {},
      },
    },
    ...optimisedDebts.map((optimisedDebt) => {
      return {
        updateOne: {
          filter: {
            from: optimisedDebt.from,
            to: optimisedDebt.to,
          },
          update: {
            $set: optimisedDebt,
          },
          upsert: true,
        },
      };
    }),
  ];

  await optimisedDebtModel.bulkWrite(operations, getSessionOptions(session));
};
