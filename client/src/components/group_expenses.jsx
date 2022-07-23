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
      // Create debt object
      let debt = {
        from: expense.lender,
        to: expense.borrowers,
        amount: expense.amount,
      };

      // Call route to add debt to db
      let validDebt = await fetch("http://localhost:3000/debts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(debt),
      });
      let debtResponse = await validDebt.json();

      // Send debt to parent component to update state
      props.onClick(debtResponse);

      // Add expense to array of expenses
      expenses.push(response);
      // Clear form
      setClearForm(true);
      // Grey out button
      setButtonStyle("ge-button add-expense-btn");
    } else {
      // Display error message
      console.error(response.error);
    }
  }

  // Check indebtedness of each user
  function checkIndebtedness(user) {
    if (debts !== undefined && debts[user.username] !== undefined) {
      return debts[user.username].amount;
    } else {
      return 0;
    }
  }

  return (
    <div className="group-expenses-container">
      <h1 className="group-name">{props.group.name}</h1>
      <h2 className="balance">
        Outstanding balance:&nbsp;
        <span
          className={
            props.group.balance < 0
              ? "balance-value user-balance-red"
              : "balance-value user-balance-green"
          }
        >
          {"£" + props.group.balance}
        </span>
      </h2>
      <section className="user-summaries-container">
        <ul className={userSummariesClass}>
          <TransitionGroup component={null}>
            {props.group.usersMinusActive.users.map((user) => (
              <CSSTransition
                timeout={500}
                classNames="summaries"
                key={user.username}
                exit={false}
              >
                <li key={user.username}>
                  <h3>
                    {user.username}
                    <span
                      className={
                        checkIndebtedness(user) === 0
                          ? "balance-value user-balance-green"
                          : "balance-value user-balance-red"
                      }
                    >
                      {"£" + checkIndebtedness(user)}
                    </span>
                  </h3>
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
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
