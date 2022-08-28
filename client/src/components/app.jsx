import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "../styles/app.css";
import GroupExpenses from "./group_expenses";
import GroupUsers from "./group_users";
import UserSwitching from "./user_switching";

function App() {
  const apiUrl = "http://localhost:3001";

  // Use this as global group
  let [group, setGroup] = useState({
    name: "4 Portal Road",
    balance: 0,
    users: [],
    activeUser: "",
    expenses: [],
    debts: [],
    usersMinusActive: {
      users: [],
      debts: [],
      outstandingBalance: 0,
    },
  });

  // Gets all debt from db
  async function getAllDebt() {
    let response = await fetch(`${apiUrl}/debts`);
    let data = await response.json();
    return data;
  }

  // Update Debts when expense is added
  async function updateDebts() {
    // Get Debts
    let debtResponse = await fetch(`${apiUrl}/debts`);
    const updatedDebt = await debtResponse.json();
    group.debts = updatedDebt;
    setActiveUserDebt();
  }

  function setActiveUserDebt() {
    group.usersMinusActive = {
      ...group.usersMinusActive,
      debts: [],
    };

    let totalDebt = 0;
    for (let i = 0; i < group.debts.length; i++) {
      if (group.debts[i].to === group.activeUser) {
        totalDebt -= group.debts[i].amount;
        group.usersMinusActive.debts[group.debts[i].from] = group.debts[i];
      } else if (group.debts[i].from === group.activeUser) {
        totalDebt += group.debts[i].amount;
        group.usersMinusActive.debts[group.debts[i].to] = group.debts[i];
      }
    }
    group.usersMinusActive.outstandingBalance =
      totalDebt % 1 ? totalDebt.toFixed(2) : totalDebt;
    setGroup({ ...group });
  }

  // Gets all expenses from db
  async function getAllExpenses() {
    const response = await fetch(`${apiUrl}/expenses`);
    const data = await response.json();
    return data;
  }

  // Gets all users from db
  async function getAllUsers() {
    const response = await fetch(`${apiUrl}/users`);
    const data = await response.json();
    return data;
  }

  function changeActiveUser(username, selectedUserIndex) {
    filterUsers(selectedUserIndex);
    group.activeUser = username;
    setActiveUserDebt();
  }

  // Update users to exclude active user
  function filterUsers(index) {
    let user = group.users.filter((user) => {
      return user.username === group.activeUser;
    });

    group.usersMinusActive.users.splice(index, 1, user[0]);
  }

  // Updates global group with data from db
  async function loadDataIntoGroup() {
    const debt = await getAllDebt();
    const expenses = await getAllExpenses();
    const users = await getAllUsers();
    group = {
      ...group,
      expenses: expenses.reverse(),
      users: users,
      activeUser: users[0].username,
      debts: debt,
      usersMinusActive: {
        users: users.slice(1),
      },
    };
    setActiveUserDebt();
  }

  // Load all users and expenses into group
  useEffect(() => {
    loadDataIntoGroup();
    // eslint-disable-next-line
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
    await fetch(`${apiUrl}/users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    setGroup({
      ...group,
      users: [...group.users, user],
      usersMinusActive: {
        users: [...group.usersMinusActive.users, user],
      },
    });
  }

  // Update group state after a user settles up
  function updateDebt(settleObject) {
    group.usersMinusActive.debts[settleObject.to].amount -= settleObject.amount;
    group.usersMinusActive.outstandingBalance -= settleObject.amount;

    setGroup({
      ...group,
    });
  }

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="title">FairSplit</h1>
        <UserSwitching group={group} onClick={changeActiveUser}></UserSwitching>
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
        <GroupExpenses group={group} onClick={updateDebts}></GroupExpenses>
        <GroupUsers
          group={group}
          // Call function based on parameter passed in onClick call
          onClick={(debts) => {
            debts ? updateDebt(debts) : updateGroup();
          }}
        ></GroupUsers>
      </div>
    </div>
  );
}

export default App;
