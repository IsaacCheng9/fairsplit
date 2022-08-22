import { React, useState, createRef } from "react";
import "../styles/group_users.css";
import User from "./user";
import AddUser from "./add_user";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function GroupUsers(props) {
  // Hold state of settle amount
  let [settleAmount, setSettleAmount] = useState(0);
  let [btnDisabled, setBtnDisabled] = useState(true);

  // Ref to user select for settling
  let userSelectRef = createRef();

  // Server URL
  const apiUrl = "http://localhost:3001";

  // Returns styles to grey out button
  function disabledBtnStyles() {
    if (btnDisabled) {
      return {
        backgroundColor: "lightgrey",
        boxShadow: "0 5px 0 grey",
        transform: "none",
        opacity: "20%",
      };
    }
  }

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

  return (
    <div className="group-members-container">
      <h1 className="group-members-title">Group Members</h1>
      <div className="users-container">
        <div className="settle-container">
          <div>
            <select name="users">
              {props.group.usersMinusActive.users.map((user) => (
                <option key={user.username}>{user.username}</option>
              ))}
            </select>
            <input type="Number" placeholder="£" maxLength="50"></input>
          </div>
          <button style={{ minWidth: "120px" }} className="ge-button">
            Settle Up
          </button>
        </div>
        <TransitionGroup component={null}>
          {props.group.usersMinusActive.users.map((user) => (
            <CSSTransition
              exit={false}
              timeout={50}
              classNames="summaries"
              key={user.username}
            >
              <User
                group={props.group.usersMinusActive}
                user={user}
                key={user.username}
              ></User>
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
