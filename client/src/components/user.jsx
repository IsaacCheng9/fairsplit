import { React } from "react";
import "../styles/user.css";

function User(props) {
  // Check indebtedness of each user
  function checkIndebtedness(user) {
    let debts = props.group.debts;
    let debt = false;

    if (debts !== undefined && debts[user.username] !== undefined) {
      if (debts[user.username].from === user.username) {
        debt = true;
      }
      return [debts[user.username].amount, debt];
    } else {
      return [0];
    }
  }

  return (
    <div className="user-container">
      <div className="user-pic"></div>
      <div className="user-username">{props.user.username}</div>
      <div className="user-balance-container">
        <div
          style={{
            backgroundColor:
              checkIndebtedness(props.user)[0].toFixed(2) === "0.00"
                ? "lightgrey"
                : "",
          }}
          className={
            checkIndebtedness(props.user)[1]
              ? "balance-value user-balance-green"
              : "balance-value user-balance-red"
          }
        >
          {"£" + (checkIndebtedness(props.user)[0] / 100).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default User;
