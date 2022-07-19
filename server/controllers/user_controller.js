const userModel = require("../models/user");

// Get all users.
exports.getUsers = async (_, response) => {
  try {
    const users = await userModel.find({});
    response.json(users);
  } catch (error) {
    {
      response.status(500).send(error);
    }
  }
};

// Get a user by ID.
exports.getUserById = async (request, response) => {
  try {
    const user = await userModel.findById(request.params.id);
    response.json(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Add a new user.
exports.addUser = async (request, response) => {
  try {
    const user = await userModel.create({
      username: request.body.username,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
    });
    response.json(user);
  } catch (error) {
    response.status(500).send(error);
  }
};
