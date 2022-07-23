import { React } from "react";
import "../styles/user.css";

function User(props) {
  // Check indebtedness of each user
  function checkIndebtedness(user) {
    let debts = props.group.debts;
    if (debts !== undefined && debts[user.username] !== undefined) {
      return debts[user.username].amount;
    } else {
      return 0;
    }
  }

  return (
    <div className="user-container">
      <div className="user-pic"></div>
      <div className="user-username">{props.user.username}</div>
      <div
        className={
          checkIndebtedness(props.user)
            ? "user-balance user-balance-red"
            : "user-balance user-balance-green"
        }
      >
        {"£" + checkIndebtedness(props.user)}
      </div>
    </div>
  );
}

export default User;
