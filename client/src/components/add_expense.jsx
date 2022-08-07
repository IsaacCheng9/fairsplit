import React, { useState, useEffect, useRef, createRef } from "react";
import "../styles/add_expense.css";
import cross from "../assets/cross.svg";
import minus from "../assets/minus.svg";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function AddExpense(props) {
  // Reactive variables for dynamic styling
  let [containerClass, setContainerClass] = useState("add-expense-container");
  let [overflowClass, setOverflowClass] = useState("overflow-container");
  let [crossRotateClass, setCrossRotateClass] = useState("");

  // Refs for dynamic styling
  let [titleRef, lenderRef, borrowerRef, amountRef] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  // Holds borrower state
  let [borrowers, setBorrowers] = useState([]);

  // Hold state for split validity and amount
  let [automaticSplit, setAutomaticSplit] = useState(true);
  let [splitAmount, setSplitAmount] = useState([""]);
  let firstAmount = useRef();

  // Calculates height to transition to when borrower is added / removed
  function calcHeight() {
    if (
      overflowClass.includes("overflow-container-expand") &&
      borrowers.length > 0
    ) {
      let calc = borrowers.length * 2.5 + 11;
      return calc + "em";
    } else if (overflowClass.includes("overflow-container-expand")) {
      return "11em";
    } else {
      return "0em";
    }
  }

  // Renders another borrower input
  function addBorrower() {
    /* TODO - Array used to store borrowers for rendering new input, 
       atm storing random number for id - probably needs changing. */
    borrowers.push([Math.random(), createRef()]);
    splitAmount.push("");
    setBorrowers([...borrowers]);
    inputValidation();
    if (automaticSplit) calcSplit();
  }

  // Adds remaining amount after split, starting with the first borrower
  function addRemainder(remainder) {
    for (let i = 0; i < remainder * 100; i++) {
      let newAmount = Number(splitAmount[i]) + 0.01;
      splitAmount[i] = newAmount.toFixed(2);
    }
  }

  // Calculate Split among borrowers
  function calcSplit() {
    let amount = amountRef.current.value;
    // Calculate split if amount is valid and user hasn't changed split value
    if (amount > 0) {
      if (automaticSplit) {
        let equalAmount = amount / (borrowers.length + 1);
        if (equalAmount % 1 !== 0) {
          // Gets value to 2 decimal points without rounding
          equalAmount = Number(equalAmount).toFixed(3);
          equalAmount = String(equalAmount).slice(0, equalAmount.length - 1);
        }
        splitAmount.fill(equalAmount);

        // If amount isn't divisible add remainder to borrowers
        let leftOver = amount - equalAmount * (borrowers.length + 1);
        if (leftOver > 0) {
          addRemainder(leftOver.toFixed(2));
        }
      } else {
        splitAmount = [amountRef.current.value];
      }
    } else {
      splitAmount.fill("");
    }

    // Re-render amounts to component
    setSplitAmount([...splitAmount]);
    inputValidation();
  }

  // Validates borrower inputs
  function borrowersValidation() {
    // Check borrower usernames are filled out
    for (const borrower of borrowers) {
      if (!borrower[1].current || borrower[1].current.value.length < 1) {
        return false;
      }
    }

    // Check borrower split values are filled out
    for (const amount of splitAmount) {
      if (amount.length < 1) {
        return false;
      }
    }
    return true;
  }

  // Validates inputs to determine whether or not button should be enabled
  function inputValidation() {
    // Check if all inputs are filled
    if (
      titleRef.current.value.length > 0 &&
      lenderRef.current.value.length > 0 &&
      borrowerRef.current.value.length > 0 &&
      amountRef.current.value.length > 0 &&
      amountRef.current.value > 0 &&
      borrowersValidation()
    ) {
      // Store usernames from refs to pass in expense object
      let usernames = [
        [borrowerRef.current.value, Number(firstAmount.current.value)],
      ];
      for (const [index, ref] of [...borrowers].entries()) {
        usernames.push([ref[1].current.value, Number(splitAmount[index])]);
      }
      // If all inputs are filled, enable button
      props.onClick(true, {
        title: titleRef.current.value,
        author: props.author,
        lender: lenderRef.current.value,
        borrowers: [...usernames],
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
    firstAmount.current.value = "";

    for (const [index, borrower] of borrowers.entries()) {
      borrower[1].current.value = "";
      splitAmount[index] = "";
    }

    splitAmount[splitAmount.length - 1] = "";

    setSplitAmount([...splitAmount]);
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
      <div
        style={{
          maxHeight: calcHeight(),
        }}
        className={overflowClass}
      >
        <div className="input-container">
          <header className="add-expense-title">Title</header>
          <input
            maxLength="50"
            onChange={inputValidation}
            ref={titleRef}
            className="title-input"
          ></input>
        </div>
        <div className="input-container">
          <header className="add-expense-amount">Amount</header>
          <input
            // Only calculate split if user hasn't changed values
            onChange={automaticSplit ? calcSplit : inputValidation}
            ref={amountRef}
            className="amount-input"
            type="number"
            min="0"
          ></input>
        </div>
        <div className="input-container">
          <header className="add-expense-lender">Lender</header>
          <input
            onChange={inputValidation}
            ref={lenderRef}
            className="lender-input"
          ></input>
        </div>
        <div className="input-container">
          <header className="add-expense-borrower">Borrower</header>
          <div className="borrower-container">
            <input
              onChange={inputValidation}
              ref={borrowerRef}
              className="borrower-input"
            ></input>
            <input
              ref={firstAmount}
              value={splitAmount[0] || ""}
              onChange={(e) => {
                // Change value to new input and re-render
                splitAmount[0] = e.target.value;
                setSplitAmount([...splitAmount]);

                // Split not longer active as user has changed value
                setAutomaticSplit(false);

                inputValidation();
              }}
              type="number"
              min="0"
              className="borrower-split"
            ></input>
            <div className="add-expense-plus" onClick={addBorrower}>
              <img alt="add-btn" className="borrower-cross" src={cross}></img>
            </div>
          </div>
        </div>
        <TransitionGroup component={null}>
          {borrowers.map((borrower, i) => (
            <CSSTransition
              timeout={500}
              unmountOnExit
              classNames="borrowers"
              key={borrower[0]}
            >
              <div className="input-container">
                <header key={borrower[0] + 1}>Borrower</header>
                <div key={borrower[0]} className="borrower-container">
                  <input
                    onChange={inputValidation}
                    ref={borrower[1]}
                    className="borrower-input"
                  ></input>
                  <input
                    type="number"
                    min="0"
                    className="borrower-split"
                    value={splitAmount[i + 1] || ""}
                    onChange={(e) => {
                      // Change value to new input and re-render
                      splitAmount[i + 1] = e.target.value;
                      setSplitAmount([...splitAmount]);

                      // Split not longer active as user has changed value
                      setAutomaticSplit(false);

                      inputValidation();
                    }}
                  ></input>
                  <div
                    className="add-expense-plus"
                    onClick={() => {
                      // Remove borrower from list and re-render
                      borrowers = borrowers.filter((t) => t !== borrower);
                      setBorrowers(borrowers);

                      // Remove reference to value
                      splitAmount.splice(i + 1, 1);

                      // Recalculate split once borrower removed
                      if (automaticSplit && amountRef.current.value > 0) {
                        calcSplit();
                      }
                    }}
                  >
                    <img
                      alt="minus-button"
                      className="borrower-cross"
                      src={minus}
                    ></img>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
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
