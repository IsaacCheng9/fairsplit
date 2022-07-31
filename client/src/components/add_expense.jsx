import React, { useState, createRef, useEffect } from "react";
import "../styles/add_expense.css";
import cross from "../assets/cross.svg";

function AddExpense(props) {
  // Reactive variables for dynamic styling
  let [containerClass, setContainerClass] = useState("add-expense-container");
  let [overflowClass, setOverflowClass] = useState("overflow-container");
  let [crossRotateClass, setCrossRotateClass] = useState("");

  // Refs for dynamic styling
  let [titleRef, lenderRef, borrowerRef, amountRef] = [
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
      lenderRef.current.value.length > 0 &&
      borrowerRef.current.value.length > 0 &&
      amountRef.current.value.length > 0 &&
      amountRef.current.value > 0
    ) {
      // If all inputs are filled, enable button
      props.onClick(true, {
        title: titleRef.current.value,
        author: props.author,
        lender: lenderRef.current.value,
        borrowers: [
          [borrowerRef.current.value, Number(amountRef.current.value)],
        ],
        amount: Number(amountRef.current.value),
      });
    } else {
      // If not, disable button
      props.onClick(false);
    }
  }

  // Clears form
  function clearInputs() {
    titleRef.current.value = "";
    lenderRef.current.value = "";
    borrowerRef.current.value = "";
    amountRef.current.value = "";
  }

  // Toggles visibility of form
  useEffect(() => {
    if (props.reset) {
      clearInputs();
      props.onReset(false);

      setTimeout(() => {
        setOverflowClass("overflow-container");
        setContainerClass("add-expense-container");
        setCrossRotateClass("");
      }, 300);
    }
  });

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
        <header className="add-expense-title">Title</header>
        <input
          maxLength="50"
          onChange={inputValidation}
          ref={titleRef}
          className="title-input"
        ></input>
        <header className="add-expense-amount">Amount</header>
        <input
          onChange={inputValidation}
          ref={amountRef}
          className="amount-input"
          type="number"
          min="0"
        ></input>
        <header className="add-expense-lender">Lender</header>
        <input
          onChange={inputValidation}
          ref={lenderRef}
          className="lender-input"
        ></input>
        <header className="add-expense-borrower">Borrowers</header>
        <div className="borrower-container">
          <input
            onChange={inputValidation}
            ref={borrowerRef}
            className="borrower-input"
          ></input>
          <input type="number" min="0" className="borrower-split"></input>
          <div className="add-expense-plus">
            <img className="borrower-cross" src={cross}></img>
          </div>
        </div>
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
