import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("otp-inputs", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("has six inputs and advances focus while typing", async () => {
    render(<App />);
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId("otp-input-" + i)).toBeInTheDocument();
    }
    const first = screen.getByTestId("otp-input-0");
    await user.click(first);
    await user.keyboard("1");
    expect(first).toHaveValue("1");
    expect(screen.getByTestId("otp-input-1")).toHaveFocus();
  });

  it("moves focus back on Backspace when empty", async () => {
    render(<App />);
    await user.click(screen.getByTestId("otp-input-0"));
    await user.keyboard("9");
    expect(screen.getByTestId("otp-input-1")).toHaveFocus();
    await user.keyboard("{Backspace}");
    expect(screen.getByTestId("otp-input-0")).toHaveFocus();
  });
});
