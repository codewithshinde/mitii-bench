import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("stopwatch-ref", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0 seconds", () => {
    render(<Page />);
    expect(screen.getByTestId("timer-display")).toHaveTextContent("0");
  });

  it("increments while running and stops when stopped", () => {
    vi.useFakeTimers();
    render(<Page />);
    fireEvent.click(screen.getByTestId("start-btn"));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("timer-display")).toHaveTextContent("3");
    fireEvent.click(screen.getByTestId("stop-btn"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("timer-display")).toHaveTextContent("3");
  });
});
