function addUserToGroup(userId, firstName, lastName, groupId) {
  return new Promise((resolve, reject) => {
    const user = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
    };
    const group = {
      id: groupId,
    };
    const userGroup = {
      user: user,
      group: group,
    };
    const userGroupId = uuid();
    const userGroupRef = firebase.database().ref(`userGroups/${userGroupId}`);
    userGroupRef
      .set(userGroup)
      .then(() => {
        resolve(userGroupId);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
