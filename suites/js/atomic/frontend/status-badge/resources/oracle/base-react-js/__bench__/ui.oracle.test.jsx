import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("status-badge", () => {
  it("starts Online with green background", () => {
    render(<App />);
    expect(screen.getByTestId("status-container")).toBeInTheDocument();
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Online");
    expect(badge).toHaveStyle({ background: "green" });
  });

  it("toggles to Offline with gray background", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("status-toggle-btn"));
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Offline");
    expect(badge).toHaveStyle({ background: "gray" });
  });

  it("toggles back to Online", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("status-toggle-btn"));
    await user.click(screen.getByTestId("status-toggle-btn"));
    expect(screen.getByTestId("status-badge")).toHaveTextContent("Online");
  });
});
