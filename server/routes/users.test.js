const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");

const usersRouter = require("../routes/users.js");
const userModel = require("../models/user");
const userDebtModel = require("../models/user_debt");

describe("Test for user routes", () => {
  const app = express();
  app.use(express.json());
  app.use(usersRouter);

  beforeAll(async () => {
    // Connect to the mock database.
    connection = await mongoose.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Delete the user we created if it still exists.
    await userModel.deleteOne({ username: "testuser123" });
    // Delete the debt record for the user we created.
    await userDebtModel.deleteOne({ username: "testuser123" });
    mongoose.connection.close();
  });

  // Check whether we can get a list of all users.
  test("GET /users", async () => {
    const server = supertest(app);
    await server.get("/users").expect(200);
  });

  // Check whether we can create a new user.
  test("POST /users", async () => {
    const server = supertest(app);
    await server
      .post("/users")
      .send({
        username: "testuser123",
        firstName: "Test",
        lastName: "User",
      })
      .expect(201);
  });

  // Check whether our user was created.
  test("GET /users/:username", async () => {
    const server = supertest(app);
    await server.get("/users/testuser123").expect(200);
  });

  // Check whether our user can be deleted.
  test("DELETE /users/:username", async () => {
    const server = supertest(app);
    await server.delete("/users/testuser123").expect(200);
  });
});
