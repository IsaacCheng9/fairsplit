import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import arrow from "../assets/arrow.svg";
import "../styles/app.css";
import GroupExpenses from "./group_expenses";
import GroupUsers from "./group_users";

function App() {
  const apiUrl = "http://localhost:3001";

  // Load all users into group
  let [group, setGroup] = useState({
    name: "4 Portal Road",
    balance: 0,
    currency: "£",
    users: [],
  });

  async function getAllUsers() {
    const response = await fetch(`${apiUrl}/users`);
    const data = await response.json();
    return data;
  }

  // Load all users into group
  useEffect(() => {
    getAllUsers().then((data) => {
      setGroup({
        ...group,
        users: data,
      });
    });
  }, []);

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

  async function updateGroup(user) {
    // Add user to db
    let response = await fetch(`${apiUrl}/users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    setGroup({
      ...group,
      users: [...group.users, user],
    });
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
