import React from "react";
import { useState } from "react";
import arrow from "../assets/arrow.svg";
import "../styles/app.css";
import GroupExpenses from "./group_expenses";
import GroupUsers from "./group_users";

function App() {
  // Temporary group to display component data
  let [group, setGroup] = useState({
    name: "4 Portal Road",
    balance: 0,
    currency: "£",
    users: [
      { username: "Jim", indebted: true, balance: 14 },
      { username: "Bob", indebted: false, balance: 4 },
      { username: "Joe", indebted: false, balance: 7 },
      { username: "Jane", indebted: false, balance: 3 },
    ],
  });

  // Calculate total balance of group
  group["balance"] = calculateTotalBalance();

  function calculateTotalBalance() {
    let totalBalance = 0;
    group.users.forEach((user) => {
      if (user.indebted) {
        totalBalance -= user.balance;
      }
    });
    return totalBalance;
  }

  function updateGroup(user) {
    let newGroup = { ...group };
    newGroup.users.push(user);
    setGroup(newGroup);
  }

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="title">FairSplit</h1>
        <a href={"#"} className="sign-in">
          Sign in
          <img className="arrow" src={arrow} />
        </a>
      </div>

      <div className="bg-container">
        <div className="bg-element bg-top-left"></div>
        <div className="bg-element bg-top-center"></div>
        <div className="bg-element bg-top-right"></div>
        <div className="bg-element bg-left"></div>
        <div className="bg-element bg-center"></div>
        <div className="bg-element bg-right"></div>
      </div>

      <div className="main-content-container">
        <GroupExpenses value={group}></GroupExpenses>
        <GroupUsers value={group} onClick={updateGroup}></GroupUsers>
      </div>
    </div>
  );
}

export default App;
