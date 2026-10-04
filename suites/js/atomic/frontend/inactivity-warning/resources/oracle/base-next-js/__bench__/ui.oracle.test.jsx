import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("inactivity-warning", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows inactivity modal after 60s idle and resets on stay active", async () => {
    render(<Page />);
    expect(screen.queryByTestId("inactivity-modal")).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(60000);
    await waitFor(() => expect(screen.getByTestId("inactivity-modal")).toBeInTheDocument());
    await user.click(screen.getByTestId("stay-active-btn"));
    expect(screen.queryByTestId("inactivity-modal")).not.toBeInTheDocument();
  });
});
