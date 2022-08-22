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

  // Call API endpoint to settle debt
  async function settleUp() {
    // Creates object to send in body
    let settleObject = {
      from: props.group.activeUser,
      to: userSelectRef.current.value,
      amount: settleAmount,
    };

    // Disable and clear form
    setBtnDisabled(true);
    setSettleAmount("");

    // Call endpoint
    let settleDebtResponse = await fetch(`${apiUrl}/debts/settle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settleObject),
    });

    // If successful update debts
    if (settleDebtResponse.status === 200) {
      props.onClick(settleObject);
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
            <select ref={userSelectRef} name="users">
              {props.group.usersMinusActive.users.map((user) => (
                <option key={user.username}>{user.username}</option>
              ))}
            </select>
            <input
              type="Number"
              placeholder="£"
              maxLength="50"
              min={0}
              value={settleAmount || ""}
              onChange={(e) => {
                settleAmount = e.target.value;
                // Handle button state based on settle-up value
                if (btnDisabled && Number(settleAmount) > 0) {
                  setBtnDisabled(false);
                } else if (
                  !btnDisabled &&
                  (!settleAmount.length || Number(settleAmount) === 0)
                ) {
                  setBtnDisabled(true);
                }
                setSettleAmount(settleAmount);
              }}
            ></input>
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
