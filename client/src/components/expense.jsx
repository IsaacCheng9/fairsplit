import React from "react";
import "../styles/expense.css";
import smallArrow from "../assets/small_arrow.svg";

function Expense(props) {
  // Format borrowers with commas
  function renderBorrowers() {
    const borrowers = [];
    props.value.borrowers.map((borrower) => {
      borrowers.push(borrower[0]);
    });

    return borrowers.join(", ");
  }

  return (
    <div className="expense">
      <div className="e-date">
        {props.value.creationDatetime.substring(0, 10)}
      </div>
      <div className="e-pic"></div>
      <div className="e-title">{props.value.title}</div>
      <div className="e-member-price">
        <div className="e-price">£{props.value.amount}</div>
        <div className="e-members">
          {renderBorrowers()}
          <img alt="arrow" className="e-arrow" src={smallArrow}></img>
          {props.value.lender}
        </div>
      </div>
    </div>
  );
}

export default Expense;
