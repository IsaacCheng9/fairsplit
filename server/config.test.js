const { getServerConfig, parsePort } = require("./config");

describe("server config", () => {
  test("requires MONGODB_URI", () => {
    expect(() => getServerConfig({})).toThrow(/MONGODB_URI/);
  });

  test("uses safe local defaults for optional runtime config", () => {
    expect(
      getServerConfig({
        MONGODB_URI: "mongodb://localhost:27017/fairsplit",
      }),
    ).toEqual({
      corsOrigin: "http://localhost:3000",
      mongoDB: "mongodb://localhost:27017/fairsplit",
      port: 3001,
    });
  });

  test("reads explicit runtime config", () => {
    expect(
      getServerConfig({
        CORS_ORIGIN: "https://example.com",
        MONGODB_URI: "mongodb://localhost:27017/fairsplit",
        PORT: "8080",
      }),
    ).toEqual({
      corsOrigin: "https://example.com",
      mongoDB: "mongodb://localhost:27017/fairsplit",
      port: 8080,
    });
  });

  test.each(["0", "-1", "abc", "3000.5"])("rejects invalid PORT %s", (port) => {
    expect(() => parsePort(port)).toThrow(/PORT/);
  });
});
