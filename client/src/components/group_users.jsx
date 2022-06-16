import React, { useState } from "react";
import "../styles/group_users.css";

function GroupUsers(props) {
  return (
    <div className="users-container">
      <h1 className="users-title">Group Members</h1>
      <div className="users"></div>
    </div>
  );
}

export default GroupUsers;
