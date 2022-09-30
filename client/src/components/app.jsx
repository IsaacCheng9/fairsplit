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
    name: "Expenses",
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
    group.usersMinusActive.outstandingBalance = totalDebt;
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
    await fetch(`${apiUrl}/users`, {
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
        ...group.usersMinusActive,
        users: [...group.usersMinusActive.users, user],
      },
    });
  }

  // Update group state after a user settles up
  async function updateDebt(settleObject) {
    // Calculate outstanding balance
    group.usersMinusActive.debts[settleObject.from].amount -=
      settleObject.amount;
    group.usersMinusActive.outstandingBalance -= settleObject.amount;

    // Create settlement object with the same structure as an expense
    let settlement = {
      title: "SETTLEMENT",
      lender: settleObject.to,
      amount: settleObject.amount,
      author: settleObject.to,
      borrowers: [settleObject.from, settleObject.amount],
    };

    // Add settlement as expense for now
    let validExpense = await fetch(
      "http://localhost:3000/expenses/settlement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settlement),
      }
    );

    let response = await validExpense.json();

    if (validExpense.ok) {
      // Add settlement to array of expenses
      group.expenses.unshift(response);
    } else {
      // Display error message
      console.error(response.error);
    }

    setGroup({
      ...group,
    });
  }

  // Update group state after smart split toggle switched
  async function updateOptimisedDebts(isOptimised) {
    let endpoint = "debts";
    if (isOptimised) {
      endpoint = "optimisedDebts";
    }

    // Get data from API
    let response = await fetch(`${apiUrl}/${endpoint}`);
    const debt = await response.json();

    // Update global state
    group.debts = debt;

    // Reclaculate debts
    setActiveUserDebt();

    // Re-render debts
    setGroup({ ...group });
  }

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="title">FairSplit</h1>
        <UserSwitching group={group} onClick={changeActiveUser}></UserSwitching>
      </div>
      <div className="main-content-container">
        <GroupExpenses group={group} onClick={updateDebts}></GroupExpenses>
        <GroupUsers
          group={group}
          // Call function based on parameter passed in onClick call
          onClick={(param) => {
            if (param.firstName) {
              updateGroup(param);
            } else if (param === true || param === false) {
              updateOptimisedDebts(param);
            } else {
              updateDebt(param);
            }
          }}
        ></GroupUsers>
      </div>
    </div>
  );
}

export default App;
