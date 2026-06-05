const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");

const debtsRouter = require("../routes/debts.js");
const helpers = require("../controllers/helpers");
const debtModel = require("../models/debt");
const expenseModel = require("../models/expense");
const optimisedDebtModel = require("../models/optimised_debt");
const userDebtModel = require("../models/user_debt");

describe("Test for debt routes", () => {
  const app = express();
  app.use(express.json());
  app.use(debtsRouter);
  let connection;

  beforeAll(async () => {
    // Connect to the mock database.
    connection = await mongoose.connect(globalThis.__MONGO_URI__, {
      dbName: "fairsplit-debts-test",
    });
    await debtModel.syncIndexes();
    await optimisedDebtModel.syncIndexes();
    await userDebtModel.syncIndexes();
  });

  afterEach(async () => {
    await debtModel.deleteMany({});
    await expenseModel.deleteMany({});
    await optimisedDebtModel.deleteMany({});
    await userDebtModel.deleteMany({});
  });

  afterAll(() => {
    connection.connection.close();
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

  test("POST /debts/add rejects negative amounts", async () => {
    const server = supertest(app);
    await server
      .post("/debts/add")
      .send({
        from: "testuser123",
        to: "testuser456",
        amount: -100,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toMatch(/greater than 0 pence/);
      });

    await expect(debtModel.countDocuments({})).resolves.toBe(0);
  });

  test("POST /debts/add rejects non-integer pence amounts", async () => {
    const server = supertest(app);
    await server
      .post("/debts/add")
      .send({
        from: "testuser123",
        to: "testuser456",
        amount: 100.5,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toMatch(/integer number of pence/);
      });
  });

  test("POST /debts/add coalesces concurrent matching debts", async () => {
    const server = supertest(app);
    await userDebtModel.create({ username: "alice", netDebt: 0 });
    await userDebtModel.create({ username: "bob", netDebt: 0 });

    await Promise.all(
      Array.from({ length: 8 }, () => {
        return server
          .post("/debts/add")
          .send({ from: "alice", to: "bob", amount: 1 })
          .expect(201);
      }),
    );

    const debts = await debtModel.find({ from: "alice", to: "bob" });
    expect(debts).toHaveLength(1);
    expect(debts[0].amount).toBe(8);

    const aliceDebt = await userDebtModel.findOne({ username: "alice" });
    const bobDebt = await userDebtModel.findOne({ username: "bob" });
    expect(aliceDebt.netDebt).toBe(8);
    expect(bobDebt.netDebt).toBe(-8);
  });

  test("simplifyDebts coalesces concurrent optimised debt rebuilds", async () => {
    await userDebtModel.create({ username: "alice", netDebt: 10 });
    await userDebtModel.create({ username: "bob", netDebt: -10 });

    await Promise.all(
      Array.from({ length: 8 }, () => {
        return helpers.simplifyDebts();
      }),
    );

    const optimisedDebts = await optimisedDebtModel.find({
      from: "alice",
      to: "bob",
    });
    expect(optimisedDebts).toHaveLength(1);
    expect(optimisedDebts[0].amount).toBe(10);
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
    await userDebtModel.create({ username: "testuser123", netDebt: 100 });
    await userDebtModel.create({ username: "testuser456", netDebt: -100 });

    const server = supertest(app);
    const response = await server
      .post("/debts/settle")
      .send({
        from: "testuser456",
        to: "testuser123",
        amount: 50,
      })
      .expect(200);

    expect(response.body.message).toMatch(/partially/);
    expect(response.body.settlement).toMatchObject({
      title: "SETTLEMENT",
      author: "testuser123",
      lender: "testuser123",
      borrowers: [["testuser456", 50]],
      amount: 50,
    });

    // Check whether the debt was successfully reduced by 50.
    await debtModel
      .findOne({
        from: "testuser123",
        to: "testuser456",
      })
      .then((debt) => {
        expect(debt.amount).toBe(50);
      });

    const borrowerDebt = await userDebtModel.findOne({
      username: "testuser123",
    });
    const lenderDebt = await userDebtModel.findOne({
      username: "testuser456",
    });
    expect(borrowerDebt.netDebt).toBe(50);
    expect(lenderDebt.netDebt).toBe(-50);

    const settlement = await expenseModel.findOne({ title: "SETTLEMENT" });
    expect(settlement.borrowers).toEqual([["testuser456", 50]]);
  });

  test("POST /debts/settle rolls back debt changes when history fails", async () => {
    await debtModel.create({
      from: "alice",
      to: "bob",
      amount: 100,
    });
    await userDebtModel.create({ username: "alice", netDebt: 100 });
    await userDebtModel.create({ username: "bob", netDebt: -100 });
    const saveSettlement = jest
      .spyOn(expenseModel.prototype, "save")
      .mockRejectedValueOnce(new Error("Forced settlement history failure."));

    const server = supertest(app);
    try {
      await server
        .post("/debts/settle")
        .send({
          from: "bob",
          to: "alice",
          amount: 50,
        })
        .expect(500);

      const debt = await debtModel.findOne({ from: "alice", to: "bob" });
      const borrowerDebt = await userDebtModel.findOne({ username: "alice" });
      const lenderDebt = await userDebtModel.findOne({ username: "bob" });

      expect(debt.amount).toBe(100);
      expect(borrowerDebt.netDebt).toBe(100);
      expect(lenderDebt.netDebt).toBe(-100);
      await expect(expenseModel.countDocuments({})).resolves.toBe(0);
    } finally {
      saveSettlement.mockRestore();
    }
  });

  // Check whether we can delete the debt we created between two users.
  test("DELETE /debts/:from/:to", async () => {
    await debtModel.create({
      from: "testuser123",
      to: "testuser456",
      amount: 100,
    });

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
