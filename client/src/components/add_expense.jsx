import React from "react";
import "../styles/add_expense.css";

function AddExpense(props) {
  return (
    <div className="add-expense-container">
      <div className="add-expense-plus">
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
  );
}

export default AddExpense;