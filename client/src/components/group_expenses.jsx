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

  // Button activator
  function buttonState(valid) {
    if (valid) {
      setButtonStyle("ge-button");
      addExpenseBtnRef.current.disabled = false;
    } else {
      setButtonStyle("ge-button add-expense-btn");
      addExpenseBtnRef.current.disabled = true;
    }
  }

  useEffect(() => {
    addExpenseBtnRef.current.disabled = true;
  }, []);

  // Scroll to bottom of container to see new expense form
  function scrollToBottom() {
    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 680);
  }

  // Add temporary expense data to array of expenses
  function addExpense() {
    const updatedExpenses = [
      ...expenses,
      {
        id: expenses.length,
        date: "25th May",
        title: "Peanut Butter",
        borrower: "Isaac",
        lender: "George",
        price: 3,
      },
    ];
    setExpenses(updatedExpenses);
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
          <Expense value={expense} key={expense.id.toString()}></Expense>
        ))}
        <AddExpense
          onClick={(selection) => {
            if (selection != undefined) {
              buttonState(selection);
            } else {
              scrollToBottom();
            }
          }}
        ></AddExpense>
      </div>
      <div className="button-container">
        <button className="ge-button">Settle Up</button>
        <button
          ref={addExpenseBtnRef}
          className={buttonStyle}
          onClick={addExpense}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default GroupExpenses;
