import React from "react";
import "../styles/user.css";

function User(props) {
    let balanceColour = "user-balance"
    
    if (props.value.indebted) {
        balanceColour += " user-balance-red"
    } else {
        balanceColour += " user-balance-green"
    }

    return (
        <div className="user-container">
            <div className="user-pic"></div>
            <div className="user-username">{props.value.username}</div>
            <div className={balanceColour}>£{props.value.balance}</div>
        </div>
    )
}

export default User;