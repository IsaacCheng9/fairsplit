import React from "react";
import user_switching from "../styles/user_switching.css";

function UserSwitching(props) {
  let users = props.value.users;

  return (
    <section className="user-switching-container">
      <select name="users">
        {users.map((user) => (
          <option key={user.username}>{user.username}</option>
        ))}
      </select>
    </section>
  );
}

export default UserSwitching;
