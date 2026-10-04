import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("lazy-suspense-tabs", () => {
  it("loads overview panel after suspense", async () => {
    render(<Page />);
    const fallback = screen.queryByTestId("suspense-fallback");
    if (fallback) {
      expect(fallback).toHaveTextContent("Loading module...");
    }
    await waitFor(() => {
      expect(screen.getByTestId("overview-panel")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("suspense-fallback")).not.toBeInTheDocument();
  });

  it("switches to analytics tab with waitFor", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByTestId("overview-panel")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /^analytics$/i }));
    await waitFor(() => {
      expect(screen.getByTestId("analytics-panel")).toBeInTheDocument();
    });
  });
});
