const express = require("express");
const userController = require("../controllers/user_controller");
const app = express();

// Get a list of all the users.
app.get("/users", userController.getUsers);

// Create a new user.
app.post("/users", userController.addUser);

// Get a user by their username.
app.get("/users/:username", userController.getUserByUsername);

// Updates a user by ID.
// app.put("/users/update/:id", userController.updateUser);

// Deletes a user by ID.
// app.delete("/users/delete/:id", userController.deleteUser);

module.exports = app;
