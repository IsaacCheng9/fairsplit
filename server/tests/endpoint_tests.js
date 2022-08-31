const app = require("../server");
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
