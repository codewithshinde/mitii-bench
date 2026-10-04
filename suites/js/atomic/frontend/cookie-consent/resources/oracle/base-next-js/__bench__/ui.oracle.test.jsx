import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("cookie-consent", () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows banner and stores acceptance in localStorage", async () => {
    const user = userEvent.setup();
    render(<Page />);
    expect(screen.getByTestId("cookie-banner")).toBeInTheDocument();
    await user.click(screen.getByTestId("accept-cookies-btn"));
    expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument();
    expect(localStorage.getItem("cookies_accepted")).toBe("true");
  });

  it("hides banner when already accepted", async () => {
    localStorage.setItem("cookies_accepted", "true");
    render(<Page />);
    await waitFor(() => {
      expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument();
    });
  });
});
