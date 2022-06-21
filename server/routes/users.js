const express = require("express");
const userModel = require("../models/user");
const app = express();

// Gets a list of all the users.
app.get("/users", async (_, response) => {
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    {
      response.status(500).send(error);
    }
  }
});

// Gets a user by ID.
// app.get("/users/:id", async (_, response) => {});

// Creates a new user.
app.post("/user/add", async (request, response) => {
  const user = await userModel.create({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
  });
  
  try {
    response.json(expense);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Updates a user by ID.
// app.put("/users/update/:id", async (request, response) => {});

// Deletes a user by ID.
// app.delete("/users/delete/:id", async (request, response) => {});

module.exports = app;
