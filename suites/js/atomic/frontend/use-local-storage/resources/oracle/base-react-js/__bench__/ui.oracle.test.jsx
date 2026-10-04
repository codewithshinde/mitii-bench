import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("use-local-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists typed value to localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("persistent-input");
    await user.type(input, "remember-me");
    await waitFor(() => {
      expect(localStorage.getItem("persistent-input")).toBe("remember-me");
    });
    expect(input).toHaveValue("remember-me");
  });

  it("restores value from localStorage on remount", async () => {
    localStorage.setItem("persistent-input", "cached");
    const { unmount } = render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("persistent-input")).toHaveValue("cached");
    });
    unmount();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("persistent-input")).toHaveValue("cached");
    });
  });
});
