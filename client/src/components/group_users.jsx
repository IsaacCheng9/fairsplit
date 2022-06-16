import React, { useState } from "react";
import "../styles/GroupUsers.css";

function GroupUsers(props) {
  return (
    <div className="users-container">
      <h1 className="users-title">{props.value.name}</h1>
      <div className="users"></div>
    </div>
  );
}

export default GroupUsers;
