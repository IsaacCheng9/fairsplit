function addGroupExpense(datetime, author, title, amount, payees, groupId) {
  return new Promise((resolve, reject) => {
    const expense = {
      datetime,
      author,
      title,
      amount,
      payees,
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
