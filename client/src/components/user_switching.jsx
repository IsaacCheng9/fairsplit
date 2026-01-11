import React, { useRef } from "react";
import "../styles/user_switching.css";

function UserSwitching(props) {
  let group = props.group;
  let selectRef = useRef();

  function handleChange() {
    // Get the selected user
    let selectedUser = group.usersMinusActive.users.filter((user) => {
      return user.username === selectRef.current.value;
    });

    // Send selected user index and username to parent component
    props.onClick(
      selectRef.current.value,
      group.usersMinusActive.users.indexOf(selectedUser[0])
    );
  }

  return (
    <section className="user-switching-container">
      <select name="users" ref={selectRef} onChange={handleChange}>
        {group.users.map((user) => (
          <option key={user.username}>{user.username}</option>
        ))}
      </select>
    </section>
  );
}

export default UserSwitching;
