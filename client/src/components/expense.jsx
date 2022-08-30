import { React, useState } from "react";
import "../styles/expense.css";
import smallArrow from "../assets/small_arrow.svg";

function Expense(props) {
  let [dynamicHeight, setDynamicHeight] = useState(0);

  function expandContainer() {
    if (dynamicHeight) {
      setDynamicHeight(0);
    } else {
      for (const borrower of props.value.borrowers) {
        dynamicHeight += 1.3;
      }
      setDynamicHeight(dynamicHeight);
    }
  }

  // Format borrowers with commas
  function renderBorrowers() {
    const borrowers = [];
    for (const borrower of props.value.borrowers) {
      borrowers.push(borrower[0]);
    }

    return borrowers.join(", ");
  }

  return (
    <div onClick={expandContainer}>
      <div className="expense">
        <div className="e-date">
          {props.value.creationDatetime.substring(0, 10)}
        </div>
        <div className="e-pic"></div>
        <div className="e-title">{props.value.title}</div>
        <div className="e-member-price">
          <div className="e-price">
            £{(props.value.amount / 100).toFixed(2)}
          </div>
          <div className="e-members">
            <div>{props.value.lender}</div>
            <img alt="arrow" className="e-arrow" src={smallArrow}></img>
            <div
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {renderBorrowers()}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          maxHeight: dynamicHeight + "em",
        }}
        className="expand-expense"
      >
        {props.value.borrowers.map((borrower) => {
          return (
            <div
              style={{
                display: "flex",
              }}
              className="e-member-price"
            >
              <div className="e-members" key={borrower[0]}>
                {borrower}
              </div>
              <img alt="arrow" className="e-arrow" src={smallArrow}></img>
              <div className="e-price" key={borrower[0] + borrower[1]}>
                {(borrower[1] / 100).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Expense;
