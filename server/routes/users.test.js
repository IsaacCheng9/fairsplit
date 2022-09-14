const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const userModel = require("../models/user");
const userDebtModel = require("../models/user_debt");

// Use the Supertest object to make requests to the app.
const api = supertest(app);

// Check whether we can get a list of all users.
test("GET /users", async () => {
  await api.get("/users").expect(200);
});

// Check whether we can create a new user.
test("POST /users", async () => {
  await api
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
  await api.get("/users/testuser123").expect(200);
});

// Check whether our user can be deleted.
test("DELETE /users/:username", async () => {
  await api.delete("/users/testuser123").expect(200);
});

afterAll(async () => {
  // TODO: Create routes to delete users and user debts.
  // Delete the user we created if it still exists.
  await userModel.deleteOne({ username: "testuser123" });
  // Delete the debt record for the user we created.
  await userDebtModel.deleteOne({ username: "testuser123" });

  mongoose.connection.close();
});
