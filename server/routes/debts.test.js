const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");

const debtsRouter = require("../routes/debts.js");
const debtModel = require("../models/debt");
const userDebtModel = require("../models/user_debt");

describe("Test for debt routes", () => {
  const app = express();
  app.use(express.json());
  app.use(debtsRouter);

  beforeAll(async () => {
    // Connect to the mock database.
    connection = await mongoose.connect(globalThis.__MONGO_URI__);
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  // Check whether we can get a list of all debts.
  test("GET /debts", async () => {
    const server = supertest(app);
    await server.get("/debts").expect(200);
  });

  // Check whether we can get a list of all optimised debts.
  test("GET /optimisedDebts", async () => {
    const server = supertest(app);
    await server.get("/optimisedDebts").expect(200);
  });

  // Check whether we can add a debt between two users.
  test("POST /debts/add", async () => {
    const server = supertest(app);
    await server
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
    const api = supertest(app);
    await api.get("/debts/testuser123/testuser456").expect(200);
  });

  // Check whether we can settle a debt between two users.
  test("POST /debts/settle", async () => {
    // Create a debt between the two users so we have something to settle.
    await debtModel.create({
      from: "testuser123",
      to: "testuser456",
      amount: 100,
    });

    const server = supertest(app);
    await server
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
    const server = supertest(app);
    await server.delete("/debts/testuser123/testuser456").expect(200);
  });

  // Check that deleting a debt updates userDebt balances correctly.
  test("DELETE /debts/:from/:to updates userDebt balances", async () => {
    const server = supertest(app);

    await userDebtModel.create({ username: "alice", netDebt: 0 });
    await userDebtModel.create({ username: "bob", netDebt: 0 });

    // Add a debt: Alice owes Bob £50.
    // This should update userDebt: Alice +50, Bob -50.
    await server
      .post("/debts/add")
      .send({ from: "alice", to: "bob", amount: 50 })
      .expect(201);
    const aliceAfterAdd = await userDebtModel.findOne({ username: "alice" });
    const bobAfterAdd = await userDebtModel.findOne({ username: "bob" });
    expect(aliceAfterAdd.netDebt).toBe(50);
    expect(bobAfterAdd.netDebt).toBe(-50);

    // Delete the debt.
    await server.delete("/debts/alice/bob").expect(200);
    const deletedDebt = await debtModel.findOne({ from: "alice", to: "bob" });
    expect(deletedDebt).toBeNull();

    // Verify userDebt balances are updated back to 0.
    const aliceAfterDelete = await userDebtModel.findOne({ username: "alice" });
    const bobAfterDelete = await userDebtModel.findOne({ username: "bob" });
    expect(aliceAfterDelete.netDebt).toBe(0);
    expect(bobAfterDelete.netDebt).toBe(0);
  });
});
