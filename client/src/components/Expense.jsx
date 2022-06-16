import React from "react";
import "../styles/expense.css";
import smallArrow from "../assets/small_arrow.svg";

function Expense(props) {
  return (
    <div className="expense">
      <div className="e-date">{props.value.date}</div>
      <div className="e-pic"></div>
      <div className="e-title">{props.value.title}</div>
      <div className="e-member-price">
        <div className="e-price">£{props.value.price}</div>
        <div className="e-members">
          {props.value.payer}
          <img className="e-arrow" src={smallArrow}></img>
          {props.value.payee}
        </div>
      </div>
    </div>
  );
}

export default Expense;
