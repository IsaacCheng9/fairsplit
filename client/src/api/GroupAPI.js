/**
 * Creates an expense that is associated to borrowers who owe money to the
 * lender.
 *
 * @param {Date} creationDatetime The date and time when the expense was
 *     created.
 * @param {String} author The user who created the expense.
 * @param {String} title The title stating what the expense was.
 * @param {String} description The description of the expense.
 * @param {Number} amount The amount of the expense in GBP.
 * @param {String} lender The user who lent money for the expense.
 * @param {String[]} borrowers The users who owe money for the expense.
 */
function addGroupExpense(
  creationDatetime,
  author,
  title,
  description,
  amount,
  lender,
  borrowers
) {
  return new Promise((resolve, reject) => {
    const expense = {
      creationDatetime,
      author,
      title,
      description,
      amount,
      lender,
      borrowers,
    };
    const url = `${baseUrl}/expenses`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}
