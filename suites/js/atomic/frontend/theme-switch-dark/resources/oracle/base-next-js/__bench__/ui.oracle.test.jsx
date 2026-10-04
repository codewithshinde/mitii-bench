import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("theme-switch-dark", () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove("dark");
  });

  it("toggles dark class on body and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const toggle = screen.getByTestId("theme-switch");
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(document.body.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    await user.click(toggle);
    expect(document.body.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("restores dark preference from localStorage", async () => {
    localStorage.setItem("theme", "dark");
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByTestId("theme-switch")).toBeChecked();
      expect(document.body.classList.contains("dark")).toBe(true);
    });
  });
});
