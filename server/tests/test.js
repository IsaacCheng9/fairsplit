const app = require("../app");
const supertest = require("supertest");

// Use the Supertest object to make requests to the app.
const api = supertest(app);

test("GET /users", async () => {
  await api.get("/users").expect(200);
});
