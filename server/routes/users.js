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
  let dbConnect = dbo.getDb("users");
  dbConnect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});

// Gets a user by ID.
userRoutes.route("/user/:id").get(function (request, response) {
  let dbConnect = dbo.getDb();
  let myQuery = { _id: objectId(request.params.id) };
  dbConnect.collection("records").findOne(myQuery, function (err, result) {
    if (err) throw err;
    response.json(result);
  });
});

// Creates a new user.
userRoutes.route("/user/add").post(function (request, response) {
  let dbConnect = dbo.getDb();
  let myObj = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
  };
  dbConnect.collection("records").insertOne(myObj, function (err, result) {
    if (err) throw err;
    response.json(result);
  });
});

// Updates a user by ID.
userRoutes.route("/user/update/:id").post(function (request, response) {
  let dbConnect = dbo.getDb();
  let myQuery = { _id: objectId(request.params.id) };
  let newValues = {
    $set: {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
    },
  };
  dbConnect
    .collection("records")
    .updateOne(myQuery, newValues, function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});

// Deletes a user by ID.
userRoutes.route("/user/delete/:id").delete(function (request, response) {
  let dbConnect = dbo.getDb();
  let myQuery = { _id: objectId(request.params.id) };
  dbConnect.collection("records").deleteOne(myQuery, function (err, result) {
    if (err) throw err;
    console.log("One user deleted.");
    response.json(result);
  });
});
*/

module.exports = app;
