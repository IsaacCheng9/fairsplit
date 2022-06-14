/**
 * Creates an expense that is associated to borrowers who owe money to the
 * lender.
 */
function addGroupExpense(
  creationDatetime,
  author,
  title,
  amount,
  lender,
  borrowers,
  groupId
) {
  return new Promise((resolve, reject) => {
    const expense = {
      creationDatetime,
      author,
      title,
      amount,
      lender,
      borrowers,
      groupId,
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
