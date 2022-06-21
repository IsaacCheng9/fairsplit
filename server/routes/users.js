const express = require("express");
const userModel = require("../models/user");
const app = express();

app.get("/users", async (request, response) => {
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    {
      response.status(500).send(error);
    }
  }
});

/*
// Gets a list of all the users.
userRoutes.route("/users").get(function (_, response) {
});

// Gets a user by ID.
userRoutes.route("/user/:id").get(function (request, response) {
});

// Creates a new user.
userRoutes.route("/user/add").post(function (request, response) {
});

// Updates a user by ID.
userRoutes.route("/user/update/:id").post(function (request, response) {
});

// Deletes a user by ID.
userRoutes.route("/user/delete/:id").delete(function (request, response) {
});
*/

module.exports = app;
