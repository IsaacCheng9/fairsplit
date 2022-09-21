import { React, useState } from "react";
import "../styles/expense.css";
import smallArrow from "../assets/small_arrow.svg";

function Expense(props) {
  let [dynamicHeight, setDynamicHeight] = useState(0);
  let [textOverflow, setTextOverflow] = useState(0);

  // Calculate conatiner height based on number of borrowers
  function expandContainer() {
    if (dynamicHeight) {
      setDynamicHeight(0);
    } else {
      for (let i = 0; i < props.value.borrowers.length; i++) {
        if (i % 4 === 0) {
          dynamicHeight += 1.86;
        }
      }
      setDynamicHeight(dynamicHeight);
    }
  }

  // Format borrowers with commas
  function renderBorrowers() {
    if (props.value.borrowers.length > 1) {
      return props.value.borrowers.length + " users";
    } else {
      return props.value.borrowers[0][0];
    }
  }

  // Check if borrower text is truncated
  function checkTextOverflow(e) {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      setTextOverflow(100);
      return 100;
    } else {
      setTextOverflow(0);
      return 0;
    }
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
              onMouseEnter={checkTextOverflow}
              onMouseLeave={() => setTextOverflow(0)}
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
        <div
          style={{
            justifySelf: "center",
            backgroundColor: "lightgrey",
            borderRadius: "5px",
            width: "1em",
            height: "1.2em",
            padding: "0.1em",
          }}
        >
          <img
            style={{
              width: "1em",
              height: "1.2em",
              transform: "rotateZ(90deg)",
            }}
            alt="arrow"
            src={smallArrow}
          ></img>
        </div>
        <div className="expense-hover" style={{ opacity: textOverflow }}>
          {props.value.lender}
          <img
            style={{
              textAlign: "center",
            }}
            alt="arrow"
            className="e-arrow"
            src={smallArrow}
          ></img>
          {renderBorrowers()}
        </div>
      </div>
      <div
        style={{
          maxHeight: dynamicHeight + "em",
          display: "flex",
          flexFlow: "wrap",
          paddingBottom: "0.2em",
        }}
        className="expand-expense"
      >
        {props.value.borrowers.map((borrower, index) => {
          return (
            <div key={borrower[0] + index} className="e-member-price">
              <div
                className="e-members"
                style={{
                  width: "auto",
                  margin: "0.3em",
                  backgroundColor: "lightgrey",
                }}
              >
                {borrower[0]}
                <img alt="arrow" className="e-arrow" src={smallArrow}></img>
                <div className="e-price">
                  {"£" + (borrower[1] / 100).toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Expense;
