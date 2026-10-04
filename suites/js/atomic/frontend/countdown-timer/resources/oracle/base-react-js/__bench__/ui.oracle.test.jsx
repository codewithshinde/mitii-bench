import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("countdown-timer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders days/hours/minutes/seconds remaining", () => {
    render(<App />);
    const display = screen.getByTestId("countdown-display");
    expect(display).toHaveTextContent(/Days/);
    expect(display).toHaveTextContent(/Hours/);
    expect(display).toHaveTextContent(/Minutes/);
    expect(display).toHaveTextContent(/Seconds/);
  });

  it("shows launched message when target is reached", async () => {
    render(<App />);
    expect(screen.getByTestId("countdown-display")).toBeInTheDocument();
    // Jump the clock past the module-scoped TARGET without ticking a full day of intervals.
    vi.setSystemTime(Date.now() + 1000 * 60 * 60 * 24 + 20000);
    await vi.advanceTimersByTimeAsync(300);
    expect(screen.getByTestId("event-launched-msg")).toHaveTextContent(/launched/i);
  });
});
