function addUserToGroup(userId) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/groups/${userId}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}
