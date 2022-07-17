const userModel = require("../models/user");

// Get all users.
exports.getUsers = async (_, response) => {
  const users = await userModel.find({});

  try {
    response.json(users);
  } catch (error) {
    {
      response.status(500).send(error);
    }
  }
};

// Get a user by ID.
exports.getUserById = async (request, response) => {
  const user = await userModel.findById(request.params.id);

  try {
    response.json(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Add a new user.
exports.addUser = async (request, response) => {
  const user = await userModel.create({
    username: request.body.username,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
  });

  try {
    response.json(user);
  } catch (error) {
    response.status(500).send(error);
  }
};
