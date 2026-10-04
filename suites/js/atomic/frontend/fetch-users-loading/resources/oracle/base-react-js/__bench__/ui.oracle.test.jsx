import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("fetch-users-loading", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows loading then the user list on success", async () => {
    render(<App />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    expect(screen.getByTestId("user-list")).toHaveTextContent("Alice");
    expect(screen.getByTestId("user-list")).toHaveTextContent("Bob");
  });

  it("shows error banner when request fails", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("checkbox", { name: /fail request/i }));
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("user-list")).not.toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Failed to fetch users"
    );
  });

  it("resolves with fake timers", async () => {
    vi.useFakeTimers();
    render(<App />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(60);
    expect(screen.getByTestId("user-list")).toBeInTheDocument();
  });
});
