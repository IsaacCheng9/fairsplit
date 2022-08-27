const userModel = require("../models/user");
const userDebtModel = require("../models/user_debt");

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
  // Create a record to track the user's net debt.
  await userDebtModel.create({
    username: request.body.username,
    netDebt: 0,
  });
  response.json(user);
};
