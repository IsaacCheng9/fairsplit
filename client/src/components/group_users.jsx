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

  async function getUserById(id) {
    let response = await fetch(apiUrl + `/users/${id}`);
    console.log(response);
  }

  // Use hook to test getUsers()
  useEffect(() => {
    getUsers();
    getUserById(1);
  }, [])

  return (
    <div className="users-container">
      <h1 className="users-title">Group Members</h1>
      <div className="users"></div>
    </div>
  );
}

export default GroupUsers;
