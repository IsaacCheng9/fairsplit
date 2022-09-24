const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const debtModel = require("../models/debt");
const debtController = require("../controllers/debt_controller");

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
  await api
    .post("/debts/add")
    .send({
      from: "testuser123",
      to: "testuser456",
      amount: 100,
    })
    .expect(201);
});

// Check whether we can get the new debt between two users.
test("GET /debts/:from/:to", async () => {
  await api.get("/debts/testuser123/testuser456").expect(200);
});

// Check whether we can settle a debt between two users.
test("POST /debts/settle", async () => {
  await api
    .post("/debts/settle")
    .send({
      from: "testuser456",
      to: "testuser123",
      amount: 50,
    })
    .expect(200);

  // Check whether the debt was successfully reduced by 50.
  await debtModel
    .findOne({
      from: "testuser123",
      to: "testuser456",
    })
    .then((debt) => {
      expect(debt.amount).toBe(50);
    });
});

// Check whether we can delete the debt we created between two users.
test("DELETE /debts/:from/:to", async () => {
  await api.delete("/debts/testuser123/testuser456").expect(200);
});

afterAll(async () => {
  // TODO: Fix open handles.
  mongoose.connection.close();
});
