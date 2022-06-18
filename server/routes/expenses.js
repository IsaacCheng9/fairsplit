const express = require("express");

// Defines our routes and takes control of requests.
const userRoutes = express.Router();
const dbo = require("../db/conn");
// Converts the ID from string to ObjectId for the _id.
const objectId = require("mongodb").ObjectId;