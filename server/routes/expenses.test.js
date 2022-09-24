const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const expenseModel = require("../models/expense");
const expenseController = require("../controllers/expense_controller");

// Use the Supertest object to make requests to the app.
const api = supertest(app);

// Check whether we can get a list of all expenses.
test("GET /expenses", async () => {
  await api.get("/expenses").expect(200);
});

// Check whether we can add an expense between two users.
test("POST /expenses/add", async () => {
  await api
    .post("/expenses/add")
    .send({
      title: "testexpense",
      author: "testuser123",
      lender: "testuser123",
      borrowers: [["testuser456", 100]],
      amount: 100,
    })
    .expect(201);
});

afterAll(async () => {
  // TODO: Create an endpoint to delete an expense and use it here.
  // Delete the expense we created.
  await expenseModel.deleteOne({ title: "testexpense" });
  // TODO: Fix open handles.
  mongoose.connection.close();
});
