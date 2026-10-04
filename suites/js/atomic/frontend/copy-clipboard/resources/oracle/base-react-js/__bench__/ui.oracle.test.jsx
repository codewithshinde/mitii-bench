import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("copy-clipboard", () => {
  let user;
  let writeText;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("copies code block contents and shows temporary feedback", async () => {
    render(<App />);
    expect(screen.getByTestId("code-block")).toHaveTextContent("console.log");
    const btn = screen.getByTestId("copy-btn");
    expect(btn).toHaveTextContent("Copy");
    await user.click(btn);
    expect(writeText).toHaveBeenCalled();
    expect(btn).toHaveTextContent("Copied!");
    await vi.advanceTimersByTimeAsync(2000);
    await waitFor(() => expect(btn).toHaveTextContent("Copy"));
  });
});
