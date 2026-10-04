import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("polling-status", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows a Healthy or Unreachable status", async () => {
    render(<App />);
    await waitFor(() => {
      const text = screen.getByTestId("server-status").textContent;
      expect(["Healthy", "Unreachable"]).toContain(text);
    });
  });

  it("pauses and resumes polling via toggle", async () => {
    render(<App />);
    const btn = screen.getByTestId("pause-polling-btn");
    expect(btn).toHaveTextContent(/pause/i);
    await user.click(btn);
    expect(btn).toHaveTextContent(/resume/i);
    await user.click(btn);
    expect(btn).toHaveTextContent(/pause/i);
  });

  it("polls on an interval while active", async () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.9);
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("server-status")).toHaveTextContent("Healthy"));
    spy.mockReturnValue(0.05);
    await vi.advanceTimersByTimeAsync(5000);
    await waitFor(() => expect(screen.getByTestId("server-status")).toHaveTextContent("Unreachable"));
    spy.mockRestore();
  });
});
