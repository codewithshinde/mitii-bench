import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("use-debounce-search", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates debounced value 500ms after typing stops", () => {
    vi.useFakeTimers();
    render(<Page />);
    fireEvent.change(screen.getByTestId("debounced-input"), {
      target: { value: "query" },
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("");
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("query");
  });

  it("resets the debounce window on continued typing", () => {
    vi.useFakeTimers();
    render(<Page />);
    const input = screen.getByTestId("debounced-input");
    fireEvent.change(input, { target: { value: "ab" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.change(input, { target: { value: "abc" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("abc");
  });
});
