import React, { useState } from "react";
import { useEffect } from "react";
import "../styles/group_users.css";

function GroupUsers(props) {
  // API URL
  let apiUrl = "http://localhost:3001";

  async function getUsers() {
    let response = await fetch(apiUrl + "/users");
    console.log(response);
  }

  // Use hook to test getUsers()
  useEffect(() => {
    getUsers();
  })

  return (
    <div className="users-container">
      <h1 className="users-title">Group Members</h1>
      <div className="users"></div>
    </div>
  );
}

export default GroupUsers;
