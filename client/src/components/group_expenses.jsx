import React, { useState, createRef, useEffect } from "react";
import "../styles/group_expenses.css";
import Expense from "./expense";
import AddExpense from "./add_expense";

function GroupExpenses(props) {
  // Reactive array of expenses
  let [expenses, setExpenses] = useState([]);
  let [buttonStyle, setButtonStyle] = useState("ge-button add-expense-btn");
  let containerRef = createRef();
  let addExpenseBtnRef = createRef();
  let [clearForm, setClearForm] = useState(false);
  let tempExpense = {};

  // Button activator
  function buttonState(valid, expense) {
    if (valid) {
      setButtonStyle("ge-button");
      tempExpense = expense;
      addExpenseBtnRef.current.disabled = false;
    } else {
      setButtonStyle("ge-button add-expense-btn");
      addExpenseBtnRef.current.disabled = true;
    }
  }

  useEffect(() => {
    addExpenseBtnRef.current.disabled = true;
  });

  // Scroll to bottom of container to see new expense form
  function scrollToBottom() {
    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 680);
  }

  // Add expense data to db
  async function addExpense() {
    // Call route to add expense to db
    let validExpense = await fetch("http://localhost:3000/expenses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempExpense),
    });

    let response = await validExpense.json();

    if (validExpense.ok) {
      // Add expense to array of expenses
      setExpenses([...expenses, response]);
      // Clear form
      setClearForm(true);
    } else {
      // Display error message
      console.error(response.error);
    }
  }

  return (
    <div className="group-expenses-container">
      <h1 className="group-name">{props.value.name}</h1>
      <h2 className="balance">
        Outstanding balance:&nbsp;
        <span className="balance-value">
          {props.value.currency}&nbsp;
          {props.value.balance}
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
            addExpense();
          }}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default GroupExpenses;
