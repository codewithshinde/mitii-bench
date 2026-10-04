import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("error-boundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows crash button initially", () => {
    render(<App />);
    expect(screen.getByTestId("crash-btn")).toBeInTheDocument();
    expect(screen.queryByTestId("error-fallback")).not.toBeInTheDocument();
  });

  it("renders fallback after crash button is clicked", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("crash-btn"));
    expect(screen.getByTestId("error-fallback")).toHaveTextContent(
      "Something went wrong"
    );
    expect(screen.queryByTestId("crash-btn")).not.toBeInTheDocument();
  });
});
