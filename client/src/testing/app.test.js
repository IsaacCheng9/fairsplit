import { render, screen } from "@testing-library/react";
import App from "../components/App";

test("renders FairSplit title", () => {
  render(<App />);
  const titleElement = screen.getByText(/FairSplit/i);
  expect(titleElement).toBeInTheDocument();
});
