import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("toast-system", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows success and error toasts in the container", async () => {
    render(<App />);
    await user.click(screen.getByTestId("btn-toast-success"));
    expect(screen.getByTestId("toast-container")).toHaveTextContent("Success");
    await user.click(screen.getByTestId("btn-toast-error"));
    expect(screen.getByTestId("toast-container")).toHaveTextContent("Error");
  });

  it("auto-dismisses toasts", async () => {
    render(<App />);
    await user.click(screen.getByTestId("btn-toast-success"));
    expect(screen.getByTestId("toast-container")).toHaveTextContent("Success");
    await vi.advanceTimersByTimeAsync(2500);
    await waitFor(() => {
      expect(screen.getByTestId("toast-container")).not.toHaveTextContent("Success");
    });
  });
});
