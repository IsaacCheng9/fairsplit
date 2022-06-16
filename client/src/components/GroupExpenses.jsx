import React, { useState } from "react";
import "../styles/GroupExpenses.css";
import Expense from "../components/Expense";

function GroupExpenses(props) {
  // Reactive array of expenses
  let [expenses, setExpenses] = useState([]);

  // Add temporary expense data to array of expenses
  function addExpense() {
    const updatedExpenses = [
      ...expenses,
      {
        id: expenses.length,
        date: "25th May",
        title: "Peanut Butter",
        payer: "Isaac",
        payee: "George",
        price: 3,
      },
    ];
    setExpenses(updatedExpenses);
  }

  return (
    <div className="group-expenses-container">
      <div className="group-image">{props.value.image}</div>
      <h1 className="group-name">{props.value.name}</h1>
      <h2 className="balance group-name">
        Outstanding balance:&nbsp;
        <span className="balance-value">
          {props.value.currency}&nbsp;
          {props.value.balance}
        </span>
      </h2>
      <div className="expense-container">
        {expenses.map((expense) => (
          <Expense value={expense} key={expense.id.toString()}></Expense>
        ))}
      </div>
      <div className="button-container">
        <button className="ge-button">Settle Up</button>
        <button className="ge-button" onClick={addExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default GroupExpenses;
