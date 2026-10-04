import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("use-local-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists typed value to localStorage", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const input = screen.getByTestId("persistent-input");
    await user.type(input, "remember-me");
    await waitFor(() => {
      expect(localStorage.getItem("persistent-input")).toBe("remember-me");
    });
    expect(input).toHaveValue("remember-me");
  });

  it("restores value from localStorage on remount", async () => {
    localStorage.setItem("persistent-input", "cached");
    const { unmount } = render(<Page />);
    await waitFor(() => {
      expect(screen.getByTestId("persistent-input")).toHaveValue("cached");
    });
    unmount();
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByTestId("persistent-input")).toHaveValue("cached");
    });
  });
});
