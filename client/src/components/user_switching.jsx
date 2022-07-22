import React from "react";
import user_switching from "../styles/user_switching.css";
import { createRef } from "react";

function UserSwitching(props) {
  let users = props.users;
  let selectRef = createRef();

  function handleChange() {
    let index = props.value.filter((user) => {
      return user.username === selectRef.current.value;
    });

    props.onClick(selectRef.current.value, props.value.indexOf(index[0]));
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
