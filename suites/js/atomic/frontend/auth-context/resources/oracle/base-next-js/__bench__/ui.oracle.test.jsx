import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("auth-context", () => {
  it("shows Guest when logged out", () => {
    render(<Page />);
    expect(screen.getByTestId("user-greeting")).toHaveTextContent("Guest");
  });

  it("logs in and shows username greeting", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("login-btn"));
    expect(screen.getByTestId("user-greeting")).toHaveTextContent(
      "Logged in as demo"
    );
  });

  it("logs out back to Guest", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("login-btn"));
    await user.click(screen.getByTestId("logout-btn"));
    expect(screen.getByTestId("user-greeting")).toHaveTextContent("Guest");
  });
});
