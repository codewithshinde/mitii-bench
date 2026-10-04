import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("debounced-autocomplete", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows suggestions after 300ms debounce", async () => {
    render(<App />);
    await user.type(screen.getByTestId("search-input"), "ap");
    expect(screen.queryByTestId("search-suggestions")).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(300);
    await waitFor(() => {
      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
    });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Apricot")).toBeInTheDocument();
  });

  it("navigates with arrow keys and selects with Enter", async () => {
    render(<App />);
    const input = screen.getByTestId("search-input");
    await user.type(input, "a");
    await vi.advanceTimersByTimeAsync(300);
    await waitFor(() => expect(screen.getByTestId("search-suggestions")).toBeInTheDocument());
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(input).toHaveValue("Apple"));
  });
});
