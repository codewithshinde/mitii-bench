import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("stepper-indicator", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("exposes completed, active, and pending step states", async () => {
    render(<Page />);
    expect(screen.getByTestId("stepper")).toBeInTheDocument();
    expect(screen.getByTestId("step-node-1")).toHaveAttribute("data-state", "completed");
    expect(screen.getByTestId("step-node-2")).toHaveAttribute("data-state", "active");
    expect(screen.getByTestId("step-node-3")).toHaveAttribute("data-state", "pending");
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByTestId("step-node-3")).toHaveAttribute("data-state", "active");
    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByTestId("step-node-2")).toHaveAttribute("data-state", "active");
  });
});
