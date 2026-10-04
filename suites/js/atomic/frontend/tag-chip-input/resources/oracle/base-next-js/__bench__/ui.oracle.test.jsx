import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("tag-chip-input", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("creates chips with Enter and comma, and deletes with X", async () => {
    render(<Page />);
    const input = screen.getByTestId("chip-input");
    await user.type(input, "react{Enter}");
    expect(screen.getByTestId("chip-react")).toBeInTheDocument();
    await user.type(input, "vite,");
    expect(screen.getByTestId("chip-vite")).toBeInTheDocument();
    await user.click(within(screen.getByTestId("chip-react")).getByRole("button", { name: "X" }));
    expect(screen.queryByTestId("chip-react")).not.toBeInTheDocument();
  });
});
