const express = require("express");
const userModel = require("../models/user");
const app = express();
const mongoose = require("mongoose");

// Gets a list of all the users.
app.get("/users", async (_, response) => {
  const users = await userModel.find({});

  try {
    response.json(users);
  } catch (error) {
    {
      response.status(500).send(error);
    }
  }
});

// Gets a user by ID.
app.get("/users/:id", async (request, response) => {
  let myQuery = request.params.id;
  const user = await userModel.findById(myQuery);

  try {
    response.json(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

// app.get("/users/:id", async (_, response) => {});

// Creates a new user.
app.post("/users/add", async (request, response) => {
  const user = await userModel.create({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
  });

  try {
    response.json(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Updates a user by ID.
// app.put("/users/update/:id", async (request, response) => {});

// Deletes a user by ID.
// app.delete("/users/delete/:id", async (request, response) => {});

module.exports = app;
