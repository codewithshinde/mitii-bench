import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("accessible-modal", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens modal and closes on Escape", async () => {
    render(<Page />);
    expect(screen.queryByTestId("accessible-modal")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /open modal/i }));
    expect(screen.getByTestId("accessible-modal")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("accessible-modal")).not.toBeInTheDocument();
  });

  it("traps focus with Tab between modal buttons", async () => {
    render(<Page />);
    await user.click(screen.getByRole("button", { name: /open modal/i }));
    const modal = screen.getByTestId("accessible-modal");
    const action = modal.querySelector("button");
    const close = screen.getByRole("button", { name: /close/i });
    expect(action).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(action).toHaveFocus();
  });
});
