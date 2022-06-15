const express = require("express");

// Defines our routes and takes control of requests.
const recordRoutes = express.Router();
const dbo = require("../db/conn");
// Converts the ID from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Gets a list of all the records.
recordRoutes.route("/record").get(function (_, response) {
  let dbConnect = dbo.getDb("users");
  dbConnect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});

// Gets a single record by ID.
recordRoutes.route("/record/:id").get(function (request, response) {
  let dbConnect = dbo.getDb();
  let myQuery = { _id: ObjectId(request.params.id) };
  dbConnect.collection("records").findOne(myQuery, function (err, result) {
    if (err) throw err;
    response.json(result);
  });
});

// Creates a new record.
recordRoutes.route("/record/add").post(function (request, response) {
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

// Updates a record by ID.
recordRoutes.route("/update/:id").post(function (request, response) {
  let dbConnect = dbo.getDb();
  let myQuery = { _id: ObjectId(request.params.id) };
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

// Deletes a record by ID.
recordRoutes.route("/delete/:id").delete(function (request, response) {
  let dbConnect = dbo.getDb();
  let myQuery = { _id: ObjectId(request.params.id) };
  dbConnect.collection("records").deleteOne(myQuery, function (err, result) {
    if (err) throw err;
    console.log("One document deleted.");
    response.json(result);
  });
});

module.exports = recordRoutes;
