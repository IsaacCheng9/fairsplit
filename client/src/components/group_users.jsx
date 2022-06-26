import React, { useState } from "react";
import { useEffect } from "react";
import "../styles/group_users.css";
import User from "./user";
import Add_User from "./add_user";

function GroupUsers(props) {
  // API URL
  let apiUrl = "http://localhost:3001";
  let users = props.value.users;
  let [addedUsers, setAddedUsers] = useState(users);

  function addUser(user) {
    const newUser = { username: user, indebted: false, balance: 0 };
    setAddedUsers([...addedUsers, newUser]);
  }

  async function getUsers() {
    let response = await fetch(apiUrl + "/users");
    console.log(response);
  }

  async function getUserById(id) {
    let response = await fetch(apiUrl + `/users/${id}`);
    console.log(response);
  }

  // Use hook to test getUsers()
  useEffect(() => {
    getUsers();
    getUserById("62b1edee24f619f5f5066f37");
  }, []);

  return (
    <div className="group-members-container">
      <h1 className="group-members-title">Group Members</h1>
      <div className="users-container">
        {addedUsers.map((user) => (
          <User value={user} key={user.username}></User>
        ))}
        <Add_User
          onClick={(user) => {
            addUser(user);
          }}
        ></Add_User>
      </div>
    </div>
  );
}

export default GroupUsers;
