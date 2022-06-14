/** 
 * Adds a user to a group so that expenses can be shared.
 * @param {String} userId The unique identifier of the user to add to the group.
 * @param {String} firstName The first name of the user.
 * @param {String} lastName The last name of the user.
 * @param {String} groupId The group to add the user to.
 */
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
