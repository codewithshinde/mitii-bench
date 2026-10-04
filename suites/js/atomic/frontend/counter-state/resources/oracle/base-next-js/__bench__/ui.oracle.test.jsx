import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("counter-state", () => {
  it("starts at 0", () => {
    render(<Page />);
    expect(screen.getByTestId("counter-container")).toBeInTheDocument();
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });

  it("increments the count", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("increment-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("2");
  });

  it("decrements but not below 0", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("decrement-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
    await user.click(screen.getByTestId("decrement-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });

  it("resets to 0", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("reset-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });
});
