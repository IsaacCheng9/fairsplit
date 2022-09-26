const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");

const expensesRouter = require("../routes/expenses.js");
const expenseModel = require("../models/expense");

describe("Test for expense routes", () => {
  const app = express();
  app.use(express.json());
  app.use(expensesRouter);

  beforeAll(async () => {
    // Connect to the mock database.
    connection = await mongoose.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Delete the expense we created.
    await expenseModel.deleteOne({
      title: "testexpense",
      author: "testuser123",
      lender: "testuser123",
      borrowers: [["testuser456", 100]],
      amount: 100,
    });
    // Delete the settlement expense we created.
    await expenseModel.deleteOne({
      title: "SETTLEMENT",
      author: "testuser456",
      lender: "testuser456",
      borrowers: [["testuser123", 100]],
      amount: 100,
    });
    mongoose.connection.close();
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
