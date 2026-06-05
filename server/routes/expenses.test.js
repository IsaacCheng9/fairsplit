const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");

const expensesRouter = require("../routes/expenses.js");
const debtModel = require("../models/debt");
const expenseModel = require("../models/expense");
const optimisedDebtModel = require("../models/optimised_debt");
const userDebtModel = require("../models/user_debt");

describe("Test for expense routes", () => {
  const app = express();
  app.use(express.json());
  app.use(expensesRouter);
  let connection;

  beforeAll(async () => {
    // Connect to the mock database.
    connection = await mongoose.connect(globalThis.__MONGO_URI__, {
      dbName: "fairsplit-expenses-test",
    });
  });

  afterEach(async () => {
    await expenseModel.deleteMany({});
    await debtModel.deleteMany({});
    await optimisedDebtModel.deleteMany({});
    await userDebtModel.deleteMany({});
  });

  afterAll(() => {
    connection.connection.close();
  });

  // Check whether we can get a list of all expenses.
  test("GET /expenses", async () => {
    const server = supertest(app);
    await server.get("/expenses").expect(200);
  });

  // Check whether we can add an expense between two users.
  test("POST /expenses", async () => {
    const server = supertest(app);
    await server
      .post("/expenses")
      .send({
        title: "testexpense",
        author: "testuser123",
        lender: "testuser123",
        borrowers: [["testuser456", 100]],
        amount: 100,
      })
      .expect(201);
  });

  test("POST /expenses accepts floating pence within rounding tolerance", async () => {
    const server = supertest(app);
    const firstBorrowerAmount = Number("0.29") * 100;
    const secondBorrowerAmount = Number("0.01") * 100;
    const totalAmount = Number("0.30") * 100;

    await server
      .post("/expenses")
      .send({
        title: "decimalexpense",
        author: "testuser123",
        lender: "testuser123",
        borrowers: [
          ["testuser456", firstBorrowerAmount],
          ["testuser789", secondBorrowerAmount],
        ],
        amount: totalAmount,
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.amount).toBe(30);
        expect(response.body.borrowers).toEqual([
          ["testuser456", 29],
          ["testuser789", 1],
        ]);
      });
  });

  test("POST /expenses rejects missing borrowers", async () => {
    const server = supertest(app);
    await server
      .post("/expenses")
      .send({
        title: "missingborrowers",
        author: "testuser123",
        lender: "testuser123",
        amount: 100,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toMatch(/Borrowers/);
      });
  });

  test("POST /expenses rejects mismatched borrower totals", async () => {
    const server = supertest(app);
    await server
      .post("/expenses")
      .send({
        title: "badtotal",
        author: "testuser123",
        lender: "testuser123",
        borrowers: [["testuser456", 99]],
        amount: 100,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toMatch(/sum of amounts owed/);
      });
  });

  test("POST /expenses rejects malformed borrowers", async () => {
    const server = supertest(app);
    await server
      .post("/expenses")
      .send({
        title: "badborrowers",
        author: "testuser123",
        lender: "testuser123",
        borrowers: [["testuser456"], ["testuser789", 100]],
        amount: 100,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toMatch(/Borrower 1/);
      });
  });

  // Check whether we can add a settlement between two users as an expense.
  test("POST /expenses/settlement", async () => {
    const server = supertest(app);
    await server
      .post("/expenses/settlement")
      .send({
        title: "SETTLEMENT",
        author: "testuser456",
        lender: "testuser456",
        borrowers: [["testuser123", 100]],
        amount: 100,
      })
      .expect(201);
  });
});
