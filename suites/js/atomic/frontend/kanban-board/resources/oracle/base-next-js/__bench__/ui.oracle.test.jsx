import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("kanban-board", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders columns and moves cards between them", async () => {
    render(<Page />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    const card = screen.getByTestId("task-card-t1");
    expect(card).toHaveTextContent("Design");
    await user.click(within(card).getByRole("button", { name: /move right/i }));
    const moved = screen.getByTestId("task-card-t1");
    expect(within(moved).getByRole("button", { name: /move left/i })).not.toBeDisabled();
    await user.click(within(moved).getByRole("button", { name: /move right/i }));
    expect(within(screen.getByTestId("task-card-t1")).getByRole("button", { name: /move right/i })).toBeDisabled();
  });
});
