import React, { useState, createRef } from "react";
import "../styles/add_expense.css";

function AddExpense(props) {
  // Reactive variables for dynamic styling
  let [containerClass, setContainerClass] = useState("add-expense-container");
  let [overflowClass, setOverflowClass] = useState("overflow-container");
  let [crossRotateClass, setCrossRotateClass] = useState("");

  // Refs for dynamic styling
  let [titleRef, authorRef, lenderRef, borrowerRef] = [
    createRef(),
    createRef(),
    createRef(),
    createRef(),
  ];

  // Validates inputs to determine whether or not button should be enabled
  function inputValidation() {
    // Check if all inputs are filled
    if (
      titleRef.current.value.length > 0 &&
      authorRef.current.value.length > 0 &&
      lenderRef.current.value.length > 0 &&
      borrowerRef.current.value.length > 0
    ) {
      console.log(titleRef.current.value.length);
      // If all inputs are filled, enable button
      props.onClick(true);
    } else {
      // If not, disable button
      props.onClick(false);
    }
  }

  // Expands add-expense container to make room for input fields
  function expandContainer() {
    if (overflowClass.includes("expand")) {
      setOverflowClass("overflow-container");
      setContainerClass("add-expense-container");
      setCrossRotateClass("");
    } else {
      setCrossRotateClass("cross-rotate");
      setContainerClass("add-expense-container add-expense-container-expand");
      setOverflowClass("overflow-container overflow-container-expand");
      props.onClick();
    }
  }

  return (
    <div>
      <div className={overflowClass}>
        <heading className="add-expense-title">Title</heading>
        <input
          onChange={inputValidation}
          ref={titleRef}
          className="title-input"
        ></input>
        <heading className="add-expense-author">Author</heading>
        <input
          onChange={inputValidation}
          ref={authorRef}
          className="author-input"
        ></input>
        <heading className="add-expense-lender">Lender</heading>
        <input
          onChange={inputValidation}
          ref={lenderRef}
          className="lender-input"
        ></input>
        <heading className="add-expense-borrower">Borrower</heading>
        <input
          onChange={inputValidation}
          ref={borrowerRef}
          className="borrower-input"
        ></input>
      </div>
      <div className={containerClass}>
        <div className="add-expense-plus" onClick={expandContainer}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Frame 1">
              <g id="cross" className={crossRotateClass}>
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
