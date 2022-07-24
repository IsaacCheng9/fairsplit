const userModel = require("../models/user");

// Get all users.
exports.getUsers = async (_, response) => {
  const users = await userModel.find({});
  response.json(users);
};

// Get a user by ID.
exports.getUserById = async (request, response) => {
  const user = await userModel.findById(request.params.id);
  response.json(user);
};

// Add a new user.
exports.addUser = async (request, response) => {
  const user = await userModel.create({
    username: request.body.username,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
  });
  response.json(user);
};
