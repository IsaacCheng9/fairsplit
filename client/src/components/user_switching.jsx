import React from "react";
import "../styles/user_switching.css";
import { createRef } from "react";

function UserSwitching(props) {
  let users = props.users;
  let selectRef = createRef();

  function handleChange() {
    // Get the selected user
    let selectedUser = props.usersMinusActive.users.filter((user) => {
      return user.username === selectRef.current.value;
    });

    // Send selected user index and username to parent component
    props.onClick(
      selectRef.current.value,
      props.usersMinusActive.users.indexOf(selectedUser[0])
    );
  }

  return (
    <section className="user-switching-container">
      <select name="users" ref={selectRef} onChange={handleChange}>
        {users.map((user) => (
          <option key={user.username}>{user.username}</option>
        ))}
      </select>
    </section>
  );
}

export default UserSwitching;
