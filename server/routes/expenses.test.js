const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const expenseModel = require("../models/expense");

// Use the Supertest object to make requests to the app.
const api = supertest(app);

// Check whether we can get a list of all expenses.
test("GET /expenses", async () => {
  await api.get("/expenses").expect(200);
});

// Check whether we can add an expense between two users.
test("POST /expenses", async () => {
  await api
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
  await api
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
  // TODO: Fix open handles.
  mongoose.connection.close();
});
