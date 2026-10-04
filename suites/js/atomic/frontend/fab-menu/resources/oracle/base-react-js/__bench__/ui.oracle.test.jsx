import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("fab-menu", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("expands and collapses child actions from the main FAB", async () => {
    render(<App />);
    expect(screen.queryByTestId("fab-child-1")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("fab-main"));
    expect(screen.getByTestId("fab-child-1")).toBeInTheDocument();
    expect(screen.getByTestId("fab-child-2")).toBeInTheDocument();
    expect(screen.getByTestId("fab-child-3")).toBeInTheDocument();
    await user.click(screen.getByTestId("fab-main"));
    expect(screen.queryByTestId("fab-child-1")).not.toBeInTheDocument();
  });
});
