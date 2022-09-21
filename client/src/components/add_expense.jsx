import React, { useState, useEffect, useRef, createRef } from "react";
import "../styles/add_expense.css";
import cross from "../assets/cross.svg";
import minus from "../assets/minus.svg";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function AddExpense(props) {
  // Reactive variables for dynamic styling
  let [containerClass, setContainerClass] = useState("add-expense-container");
  let [overflowClass, setOverflowClass] = useState("overflow-container");

  // State for lender field
  let [activeLender, setActiveLender] = useState(props.activeUser);

  // State for expense amount - value locked with input
  let [expenseAmount, setExpenseAmount] = useState("");

  // Holds expense to be added
  let [tempExpense, setTempExpense] = useState({});

  // Holds 'add expense' button state
  let [btnDisabled, setBtnDisabled] = useState(true);

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

  // Update lender state when active user is updated in root element
  useEffect(() => {
    setActiveLender(props.activeUser);
  }, [props.activeUser]);

  // Calculates height to transition to when borrower is added / removed
  function calcHeight() {
    if (
      overflowClass.includes("overflow-container-expand") &&
      borrowers.length > 0
    ) {
      let calc = borrowers.length * 2.5 + 11;
      return calc + "em";
    } else if (overflowClass.includes("overflow-container-expand")) {
      return "9.8em";
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
      if (
        !borrower[1].current ||
        borrower[1].current.value.length < 1 ||
        borrower[1].current.value.includes("--- S")
      ) {
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
      !borrowerRef.current.value.includes("--- S") &&
      amountRef.current.value.length > 0 &&
      amountRef.current.value > 0 &&
      borrowersValidation()
    ) {
      // Store usernames from refs to pass in expense object
      let usernames = [
        [borrowerRef.current.value, Number(firstAmount.current.value) * 100],
      ];
      for (const [index, ref] of [...borrowers].entries()) {
        usernames.push([
          ref[1].current.value,
          Number(splitAmount[index + 1]) * 100,
        ]);
      }
      // If all inputs are filled, enable button
      setBtnDisabled(false);

      setTempExpense({
        title: titleRef.current.value,
        author: props.author,
        lender: lenderRef.current.value,
        borrowers: [...usernames],
        amount: expenseAmount * 100,
      });
    } else {
      // If not, disable button
      setBtnDisabled(true);
    }
  }

  // Clears form
  function clearInputs() {
    titleRef.current.value = "";
    lenderRef.current.value = "";
    borrowerRef.current.value = "";
    amountRef.current.value = "";
    firstAmount.current.value = "";
    setExpenseAmount("");

    for (const [index, borrower] of borrowers.entries()) {
      borrower[1].current.value = "";
      splitAmount[index] = "";
    }

    splitAmount[splitAmount.length - 1] = "";

    setSplitAmount([...splitAmount]);
    setBtnDisabled(true);
  }

  // Toggles visibility of form
  useEffect(() => {
    if (props.reset) {
      clearInputs();
      props.onReset(false);

      setTimeout(() => {
        setOverflowClass("overflow-container");
        setContainerClass("add-expense-container");
      }, 300);
    }
  });

  // Expands add-expense container to make room for input fields
  function expandContainer() {
    if (overflowClass.includes("expand")) {
      setOverflowClass("overflow-container");
      setContainerClass("add-expense-container");
    } else {
      setContainerClass("add-expense-container add-expense-container-expand");
      setOverflowClass("overflow-container overflow-container-expand");
    }
  }

  // Returns styles to grey out button
  function disabledBtnStyles() {
    if (btnDisabled) {
      return {
        backgroundColor: "lightgrey",
        boxShadow: "0 5px 0 grey",
        transform: "none",
        opacity: "20%",
      };
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
            placeholder="£"
            // Only calculate split if user hasn't changed values
            onChange={(e) => {
              if (e.target.value === "") {
                expenseAmount = "";
              } else if (e.target.value === "0.0") {
                expenseAmount = e.target.value;
              } else if (!e.target.value.includes("0.00")) {
                // Only allow 2 decimal places
                expenseAmount = Math.round(e.target.value * 100) / 100;
              }
              automaticSplit ? calcSplit() : inputValidation();
              setExpenseAmount(expenseAmount);
            }}
            value={expenseAmount}
            ref={amountRef}
            className="amount-input"
            type="number"
            min={0}
          ></input>
        </div>
        <div className="input-container">
          <header className="add-expense-lender">Lender</header>
          <select
            onChange={(e) => {
              setActiveLender(e.target.value);
              inputValidation();
            }}
            ref={lenderRef}
            className="user-dropdown"
            value={activeLender}
          >
            {props.groupUsers.map((user) => (
              <option key={user.username}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <header className="add-expense-borrower">Borrower</header>
          <div className="borrower-container">
            <select
              onChange={inputValidation}
              ref={borrowerRef}
              className="user-dropdown"
            >
              <option>--- Select a user ---</option>
              {props.usersMinusActive.users
                .filter((user) => user.username !== lenderRef.current.value)
                .map((user) => (
                  <option key={user.username}>{user.username}</option>
                ))}
            </select>
            <input
              placeholder="£"
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
                  <select
                    onChange={inputValidation}
                    ref={borrower[1]}
                    className="user-dropdown"
                  >
                    <option>--- Select a user ---</option>
                    {props.usersMinusActive.users
                      .filter(
                        (user) => user.username !== lenderRef.current.value
                      )
                      .map((user) => (
                        <option key={user.username}>{user.username}</option>
                      ))}
                  </select>
                  {/* <input
                    onChange={inputValidation}
                    ref={borrower[1]}
                    className="borrower-input"
                  ></input> */}
                  <input
                    placeholder="£"
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
        <div className="button-container">
          <button onClick={expandContainer} className="ge-button">
            Add Expense
          </button>
          <button
            disabled={btnDisabled}
            className="ge-button"
            style={disabledBtnStyles()}
            onClick={() => {
              props.onClick(tempExpense);
            }}
          >
            Confirm Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
