import React, { useState, createRef, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../styles/group_expenses.css";
import Expense from "./expense";
import AddExpense from "./add_expense";

function GroupExpenses(props) {
  // Array of expenses & debts
  let expenses = props.group.expenses;

  // Refs for transitions
  let containerRef = createRef();
  let addExpenseBtnRef = createRef();

  // Reactive states for adding styles
  let [buttonStyle, setButtonStyle] = useState("ge-button add-expense-btn");
  let [clearForm, setClearForm] = useState(false);
  let [tempExpense, setTempExpense] = useState({});

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
  });

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
      expenses.unshift(response);
    } else {
      // Display error message
      console.error(response.error);
    }
    // Clear form
    setClearForm(true);
    // Grey out button
    setButtonStyle("ge-button add-expense-btn");
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
        <AddExpense
          onClick={(selection, expense) => {
            if (selection !== undefined) {
              buttonState(selection, expense);
            }
          }}
          reset={clearForm}
          author={props.group.activeUser}
          onReset={(reset) => {
            setClearForm(reset);
          }}
        ></AddExpense>
        <TransitionGroup component={null}>
          {expenses.map((expense) => (
            <CSSTransition
              exit={false}
              timeout={50}
              classNames="summaries"
              key={expense.creationDatetime}
            >
              <Expense value={expense} key={expense.creationDatetime}></Expense>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      {/* <div className="button-container">
        <button
          ref={addExpenseBtnRef}
          className={buttonStyle}
          onClick={() => {
            addExpense(tempExpense);
          }}
        >
          Add Expense
        </button>
      </div> */}
    </div>
  );
}

export default GroupExpenses;
