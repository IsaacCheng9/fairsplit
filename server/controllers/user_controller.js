const userModel = require("../models/user");
const userDebtModel = require("../models/user_debt");

// Get all users.
exports.getUsers = async (_, response) => {
  const users = await userModel.find({});
  response.json(users);
};

exports.getUserByUsername = async (request, response) => {
  const user = await userModel.findOne({ username: request.params.username });
  response.json(user);
};

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
  response.status(201).json(user);
};

exports.deleteUser = async (request, response) => {
  const user = await userModel.deleteOne({ username: request.params.username });
  response.json(user);
};
