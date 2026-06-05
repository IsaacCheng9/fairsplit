import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../components/app";

function mockJsonResponse(body, options = {}) {
  return Promise.resolve({
    ok: options.ok ?? true,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options?.method === "POST" && url === "/users") {
      const body = JSON.parse(options.body);
      return mockJsonResponse({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
      });
    }

    if (url === "/users") {
      return mockJsonResponse([]);
    }

    if (url === "/debts" || url === "/expenses") {
      return mockJsonResponse([]);
    }

    throw new Error(`Unexpected fetch: ${url}`);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders FairSplit title", async () => {
  render(<App />);
  const titleElement = screen.getByText(/FairSplit/i);
  expect(titleElement).toBeInTheDocument();
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith("/users");
  });
});

test("renders first-user flow for an empty database", async () => {
  render(<App />);

  expect(
    await screen.findByRole("button", { name: /add user/i }),
  ).toBeVisible();
  expect(screen.getByText(/Group Members/i)).toBeInTheDocument();
  expect(screen.queryByText(/You owe/i)).not.toBeInTheDocument();
});

test("makes the first added user active", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(await screen.findByRole("button", { name: /add user/i }));
  await user.type(screen.getByRole("textbox"), "alice");
  await user.click(screen.getByRole("button", { name: /add user/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "/users",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
  await waitFor(() => {
    expect(screen.getAllByDisplayValue("alice").length).toBeGreaterThan(0);
  });
});
