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
    if (props.value.users.length > 4) {
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
    console.log(response);

    if (validExpense.ok) {
      // Add expense to array of expenses
      setExpenses([...expenses, response]);
      // Clear form
      setClearForm(true);
      // Grey out button
      setButtonStyle("ge-button add-expense-btn");
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
      <section className="user-summaries-container">
        <ul className={userSummariesClass}>
          {props.value.users.map((user) => (
            <li key={user.username}>
              <h3>
                {user.username}&nbsp;
                <span className="balance-value">
                  {props.value.currency}
                  {user.balance}
                </span>
                &nbsp;
              </h3>
            </li>
          ))}
        </ul>
      </section>
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
