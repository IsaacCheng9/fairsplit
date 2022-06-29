import React, { useState } from "react";
import "../styles/add_expense.css";

function AddExpense(props) {
  // Reactive variables for dynamic styling
  let [containerClass, setContainerClass] = useState("add-expense-container");
  let [plusClass, setPlusClass] = useState("add-expense-plus");
  let [fristClass, setFirstClass] = useState("add-expense-title");
  let [secondClass, setSecondClass] = useState("title-input");
  let [overflowClass, setOverflowClass] = useState("overflow-container");

  // Expands add-expense container to make room for input fields
  function expandContainer() {
    if (overflowClass.includes("expand")) {
      setOverflowClass("overflow-container");
    } else {
      setContainerClass("add-expense-container add-expense-container-expand");
      setFirstClass("add-expense-title add-expense-title-expand");
      setSecondClass("title-input title-input-expand");
      setOverflowClass("overflow-container overflow-container-expand");
      props.onClick();
    }
  }

  return (
    <div>
      <div className={overflowClass}>
        <heading className={fristClass}>Title</heading>
        <input className={secondClass}></input>
        <heading className="add-expense-author">Author</heading>
        <input className="author-input"></input>
        <heading className="add-expense-lender">Lender</heading>
        <input className="lender-input"></input>
        <heading className="add-expense-borrower">Borrower</heading>
        <input className="borrower-input"></input>
      </div>
      <div className={containerClass}>
        <div className={plusClass} onClick={expandContainer}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Frame 1">
              <g id="cross">
                <line
                  id="y-line"
                  x1="50.5"
                  y1="15"
                  x2="50.5"
                  y2="86"
                  stroke="black"
                  strokeWidth="4"
                />
                <line
                  id="x-line"
                  x1="14"
                  y1="49.5"
                  x2="85"
                  y2="49.5"
                  stroke="black"
                  strokeWidth="4"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
