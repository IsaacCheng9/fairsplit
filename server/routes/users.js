const express = require("express");
const userController = require("../controllers/user_controller");
const { asyncHandler, errorHandler } = require("../middleware/errors");
const { validateUser } = require("../middleware/validation");
const app = express();

// Get a list of all the users.
app.get("/users", asyncHandler(userController.getUsers));

// Create a new user.
app.post("/users", validateUser, asyncHandler(userController.addUser));

// Get a user by their username.
app.get("/users/:username", asyncHandler(userController.getUserByUsername));

// Delete a user by their username.
app.delete("/users/:username", asyncHandler(userController.deleteUser));

app.use(errorHandler);

module.exports = app;
