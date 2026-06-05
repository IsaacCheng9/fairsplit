import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "../styles/app.css";
import { apiPath } from "../api";
import AddUser from "./add_user";
import GroupExpenses from "./group_expenses";
import GroupUsers from "./group_users";
import UserSwitching from "./user_switching";

function App() {
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
  let [isLoading, setIsLoading] = useState(true);

  // Gets all debt from db
  async function getAllDebt() {
    let response = await fetch(apiPath("/debts"));
    let data = await response.json();
    return data;
  }

  // Update Debts when expense is added
  async function updateDebts() {
    // Get Debts
    let debtResponse = await fetch(apiPath("/debts"));
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
    const response = await fetch(apiPath("/expenses"));
    const data = await response.json();
    return data;
  }

  // Gets all users from db
  async function getAllUsers() {
    const response = await fetch(apiPath("/users"));
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
    try {
      const debt = await getAllDebt();
      const expenses = await getAllExpenses();
      const users = await getAllUsers();
      const activeUser = users.length > 0 ? users[0].username : "";
      group = {
        ...group,
        expenses: expenses.reverse(),
        users: users,
        activeUser: activeUser,
        debts: debt,
        usersMinusActive: {
          ...group.usersMinusActive,
          users: activeUser ? users.slice(1) : [],
        },
      };
      setActiveUserDebt();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
    const response = await fetch(apiPath("/users"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const createdUser = await response.json();
    if (!response.ok) {
      console.error(createdUser.error);
      return;
    }

    const users = [...group.users, createdUser];
    const activeUser = group.activeUser || createdUser.username;
    const usersMinusActive = users.filter((user) => {
      return user.username !== activeUser;
    });

    setGroup({
      ...group,
      users: users,
      activeUser: activeUser,
      usersMinusActive: {
        ...group.usersMinusActive,
        users: usersMinusActive,
      },
    });
  }

  // Update group state after a user settles up
  async function updateDebt(settlement) {
    const settledUsername = settlement.borrowers[0][0];
    const settledAmount = settlement.amount;
    const settledDebt = group.usersMinusActive.debts[settledUsername];

    // Calculate outstanding balance
    if (settledDebt) {
      settledDebt.amount -= settledAmount;
      if (settledDebt.amount <= 0) {
        delete group.usersMinusActive.debts[settledUsername];
      }
    }
    group.usersMinusActive.outstandingBalance -= settledAmount;

    // Add settlement to array of expenses
    group.expenses.unshift(settlement);

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
    let response = await fetch(apiPath(`/${endpoint}`));
    const debt = await response.json();

    // Update global state
    group.debts = debt;

    // Reclaculate debts
    setActiveUserDebt();

    // Re-render debts
    setGroup({ ...group });
  }

  if (isLoading) {
    return (
      <div className="App">
        <div className="header-container">
          <h1 className="title">FairSplit</h1>
        </div>
      </div>
    );
  }

  if (group.users.length === 0) {
    return (
      <div className="App">
        <div className="header-container">
          <h1 className="title">FairSplit</h1>
        </div>
        <div className="main-content-container">
          <div className="group-members-container">
            <h1 className="group-members-title">Group Members</h1>
            <div className="users-container">
              <AddUser
                onClick={(username) => {
                  updateGroup({
                    username: username,
                    firstName: "Cosmo",
                    lastName: "Kramer",
                    indebted: false,
                    balance: 0,
                  });
                }}
              ></AddUser>
            </div>
          </div>
        </div>
      </div>
    );
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
