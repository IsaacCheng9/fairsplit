const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const userModel = require("../models/user");
const userDebtModel = require("../models/user_debt");

// Use the Supertest object to make requests to the app.
const api = supertest(app);

// Check whether we can get a list of all debts.
test("GET /debts", async () => {
  await api.get("/debts").expect(200);
});

// Check whether we can get a list of all optimised debts.
test("GET /optimisedDebts", async () => {
  await api.get("/optimisedDebts").expect(200);
});

// Check whether we can add a debt between two users.
test("POST /debts/add", async () => {
  await api.post("/debts/add").send({
    from: "testuser123",
    to: "testuser456",
    amount: 100,
  }).expect(201);
});

afterAll(async () => {
  // TODO: Fix open handles.
  mongoose.connection.close();
});
