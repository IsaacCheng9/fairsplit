import React, { useState } from "react";
import { useEffect } from "react";
import "../styles/group_users.css";
import User from "./user";
import AddUser from "./add_user";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function GroupUsers(props) {
  // API URL
  let apiUrl = "http://localhost:3001";
  let users = props.value.users;

  function addUserToGroup(user) {
    const newUser = {
      username: user,
      firstName: "Cosmo",
      lastName: "Kramer",
      indebted: false,
      balance: 0,
    };
    props.onClick(newUser);
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
        <TransitionGroup component={null}>
          {users.map((user) => (
            <CSSTransition
              timeout={50}
              classNames="transform-in"
              key={user.username}
            >
              <User value={user} key={user.username}></User>
            </CSSTransition>
          ))}
          <CSSTransition key={"add-user"} timeout={50}>
            <AddUser
              onClick={(user) => {
                addUserToGroup(user);
              }}
            ></AddUser>
          </CSSTransition>{" "}
        </TransitionGroup>
      </div>
    </div>
  );
}

export default GroupUsers;
