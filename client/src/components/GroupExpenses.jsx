import React from "react";
import "../styles/GroupExpenses.css";

function GroupExpenses(props) {
  return (
    <div className="group-expenses-container">
      <div className="group-image"></div>
      <h1 className="group-name">{props.value.name}</h1>
      <h2 className="balance group-name">
        Outstanding balance:&nbsp;
        <span class="balance-value">
          {props.value.currency}&nbsp;
          {props.value.balance}
        </span>
      </h2>
    </div>
  );
}

export default GroupExpenses;
