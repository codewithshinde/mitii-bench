import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("breadcrumb-nav", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("shows path segments and updates when navigating", async () => {
    render(<App />);
    const nav = screen.getByTestId("breadcrumb-nav");
    expect(nav).toHaveTextContent("Home");
    expect(nav).toHaveTextContent("Products");
    expect(nav).toHaveTextContent("Electronics");
    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByTestId("breadcrumb-nav")).toHaveTextContent("Home");
    expect(screen.getByTestId("breadcrumb-nav")).not.toHaveTextContent("Electronics");
    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.getByTestId("breadcrumb-nav")).toHaveTextContent("Products");
  });
});
