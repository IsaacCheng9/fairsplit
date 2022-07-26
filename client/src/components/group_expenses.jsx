import React, { useState, createRef, useEffect } from "react";
import "../styles/group_expenses.css";
import Expense from "./expense";
import AddExpense from "./add_expense";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function GroupExpenses(props) {
  // Array of expenses & debts
  let expenses = props.group.expenses;
  let debts = props.group.usersMinusActive.debts;

  // Refs for transitions
  let containerRef = createRef();
  let addExpenseBtnRef = createRef();

  // Reactive states for adding styles
  let [buttonStyle, setButtonStyle] = useState("ge-button add-expense-btn");
  let [clearForm, setClearForm] = useState(false);
  let [tempExpense, setTempExpense] = useState({});
  let [userSummariesClass, setUserSummariesClass] = useState("user-summaries");

  // Button activator
  function buttonState(valid, expense) {
    if (valid) {
      setButtonStyle("ge-button");
      setTempExpense(expense);
      addExpenseBtnRef.current.disabled = false;
    } else {
      setButtonStyle("ge-button add-expense-btn");
      addExpenseBtnRef.current.disabled = true;
    }
  }

  useEffect(() => {
    if (clearForm) {
      addExpenseBtnRef.current.disabled = true;
    }

    // Change alignment of user summaries based on overflow of users
    if (props.group.users.length > 4) {
      setUserSummariesClass("user-summaries user-summaries-overflow");
    } else {
      setUserSummariesClass("user-summaries");
    }
  });

  // Scroll to bottom of container to see new expense form
  function scrollToBottom() {
    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 680);
  }

  // Add expense data to db
  async function addExpense(expense) {
    // Call route to add expense to db
    let validExpense = await fetch("http://localhost:3000/expenses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    let response = await validExpense.json();

    if (validExpense.ok) {
      // Tell parent component to get latest debts
      props.onClick();
      // Add expense to array of expenses
      expenses.push(response);
    } else {
      // Display error message
      console.error(response.error);
    }
    // Clear form
    setClearForm(true);
    // Grey out button
    setButtonStyle("ge-button add-expense-btn");
  }

  // Check indebtedness of each user
  function checkIndebtedness(user) {
    let debt = true;

    if (debts !== undefined && debts[user.username] !== undefined) {
      if (debts[user.username].to !== user.username) {
        debt = false;
      }
      return [debts[user.username].amount, debt];
    } else {
      return [0, debt];
    }
  }

  return (
    <div className="group-expenses-container">
      <h1 className="group-name">{props.group.name}</h1>
      <h2 className="balance">
        {props.group.usersMinusActive.outstandingBalance > 0
          ? "You owe: "
          : "You are owed: "}
        <span
          className={
            props.group.usersMinusActive.outstandingBalance > 0
              ? "balance-value user-balance-red"
              : "balance-value user-balance-green"
          }
        >
          {props.group.usersMinusActive.outstandingBalance < 0
            ? "£" +
              String(props.group.usersMinusActive.outstandingBalance).substring(
                1
              )
            : "£" + props.group.usersMinusActive.outstandingBalance}
        </span>
      </h2>
      <div className="expense-container" ref={containerRef}>
        {expenses.map((expense) => (
          <Expense value={expense} key={expense.creationDatetime}></Expense>
        ))}
        <AddExpense
          onClick={(selection, expense) => {
            if (selection !== undefined) {
              buttonState(selection, expense);
            } else {
              scrollToBottom();
            }
          }}
          reset={clearForm}
          onReset={(reset) => {
            setClearForm(reset);
          }}
        ></AddExpense>
      </div>
      <div className="button-container">
        <button className="ge-button">Settle Up</button>
        <button
          ref={addExpenseBtnRef}
          className={buttonStyle}
          onClick={() => {
            addExpense(tempExpense);
          }}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default GroupExpenses;
