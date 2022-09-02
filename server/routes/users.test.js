const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Use the Supertest object to make requests to the app.
const api = supertest(app);

test("GET /users", async () => {
  await api.get("/users").expect(200);
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
