import React from "react";

function UserSwitching(props) {
  return (
    <section className="user-switching-container">
      <select name="users">
        {props.value.users.map((user) => {
          <option key={user.username}>{user.username}</option>;
        })}
      </select>
    </section>
  );
}

export default UserSwitching;
