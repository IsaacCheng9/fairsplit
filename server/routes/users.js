const express = require("express");
const userController = require("../controllers/user_controller");
const app = express();

// Gets a list of all the users.
app.get("/users", userController.getUsers);

// Gets a user by ID.
app.get("/users/:id", userController.getUserById);

// Creates a new user.
app.post("/users/add", userController.addUser);

// Updates a user by ID.
// app.put("/users/update/:id", userController.updateUser);

// Deletes a user by ID.
// app.delete("/users/delete/:id", userController.deleteUser);

module.exports = app;
