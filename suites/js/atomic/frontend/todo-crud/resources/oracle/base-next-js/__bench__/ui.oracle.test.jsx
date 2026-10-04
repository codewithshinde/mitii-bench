import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("todo-crud", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("adds todos to the list", async () => {
    render(<Page />);
    await user.type(screen.getByTestId("todo-input"), "Buy milk");
    await user.click(screen.getByTestId("add-todo-btn"));
    expect(within(screen.getByTestId("todo-list")).getByText("Buy milk")).toBeInTheDocument();
  });

  it("toggles complete via checkbox", async () => {
    render(<Page />);
    await user.type(screen.getByTestId("todo-input"), "Task");
    await user.click(screen.getByTestId("add-todo-btn"));
    const check = screen.getByTestId("todo-check-1");
    expect(check).not.toBeChecked();
    await user.click(check);
    expect(check).toBeChecked();
  });

  it("deletes a todo", async () => {
    render(<Page />);
    await user.type(screen.getByTestId("todo-input"), "Temp");
    await user.click(screen.getByTestId("add-todo-btn"));
    await user.click(screen.getByTestId("todo-delete-1"));
    expect(screen.queryByText("Temp")).not.toBeInTheDocument();
  });

  it("edits on double-click", async () => {
    render(<Page />);
    await user.type(screen.getByTestId("todo-input"), "Old");
    await user.click(screen.getByTestId("add-todo-btn"));
    await user.dblClick(screen.getByText("Old"));
    const edit = screen.getByDisplayValue("Old");
    await user.clear(edit);
    await user.type(edit, "New{Enter}");
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
