import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "../styles/app.css";
import GroupExpenses from "./group_expenses";
import GroupUsers from "./group_users";
import UserSwitching from "./user_switching";

function App() {
  const apiUrl = "http://localhost:3001";

  // All users excluding active user
  let [filteredUsers, setFilteredUsers] = useState([]);

  // Debts
  const [debts, setDebts] = useState();

  // Use this as global group
  let [group, setGroup] = useState({
    name: "4 Portal Road",
    balance: 0,
    currency: "£",
    users: [],
    activeUser: "",
    expenses: [],
  });

  // Gets all debt from db
  async function getAllDebt() {
    let response = await fetch(`${apiUrl}/debts`);
    let data = await response.json();
    return data;
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

  function changeActiveUser(username, index) {
    setGroup({
      ...group,
      activeUser: username,
    });
    filterUsers(index);
  }

  // Update users to exclude active user
  function filterUsers(index) {
    let user = group.users.filter((user) => {
      return user.username === group.activeUser;
    });
    filteredUsers.splice(index, 1, user[0]);
  }

  // Updates global group with data from db
  async function loadDataIntoGroup() {
    const debt = await getAllDebt();
    const expenses = await getAllExpenses();
    const users = await getAllUsers();
    setFilteredUsers(users.slice(1));
    setDebts(debt);
    setGroup({
      ...group,
      expenses: expenses,
      users: users,
      activeUser: users[0].username,
    });
  }

  // Load all users and expenses into group
  useEffect(() => {
    loadDataIntoGroup();
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
        <UserSwitching
          users={group.users}
          onClick={changeActiveUser}
          value={filteredUsers}
        ></UserSwitching>
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
        <GroupExpenses
          filteredUsers={filteredUsers}
          value={group}
        ></GroupExpenses>
        <GroupUsers
          filteredUsers={filteredUsers}
          value={group}
          onClick={updateGroup}
        ></GroupUsers>
      </div>
    </div>
  );
}

export default App;
