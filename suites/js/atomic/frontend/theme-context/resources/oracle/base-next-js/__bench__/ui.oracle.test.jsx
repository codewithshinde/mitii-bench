import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("theme-context", () => {
  it("starts in light theme", () => {
    render(<Page />);
    const panel = screen.getByTestId("content-panel");
    expect(panel).toHaveTextContent(/light/i);
    expect(panel).toHaveStyle({ background: "#f5f5f5" });
  });

  it("toggles to dark theme", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("theme-toggle"));
    const panel = screen.getByTestId("content-panel");
    expect(panel).toHaveTextContent(/dark/i);
    expect(panel).toHaveStyle({ background: "#222" });
  });

  it("toggles back to light", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("theme-toggle"));
    await user.click(screen.getByTestId("theme-toggle"));
    expect(screen.getByTestId("content-panel")).toHaveTextContent(/light/i);
  });
});
