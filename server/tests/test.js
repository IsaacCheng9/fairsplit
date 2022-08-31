const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

// Connect to MongoDB before running each test.
beforeEach((done) => {
  mongoose.connect(
    "mongodb://localhost:27017/JestDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

// Remove all data from the database after each test.
afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

// TODO: Test /users/add endpoint.
test("Test /users/add endpoint", async () => {
  const response = await supertest(app).post("/users/add").send({
    username: "test",
    firstName: "Test",
    lastName: "User",
  });
  expect(response.statusCode).toBe(200);
  expect(response.body.username).toBe("test");
  expect(response.body.firstName).toBe("Test");
  expect(response.body.lastName).toBe("User");
}).timeout(10000);
