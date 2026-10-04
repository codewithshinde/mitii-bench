import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../src/App.jsx";

afterEach(() => cleanup());

describe("site-nav-pages", () => {
  it("shows Home by default with BenchApp brand", () => {
    render(<App />);
    expect(screen.getByText("BenchApp")).toBeInTheDocument();
    expect(screen.getByTestId("main-nav")).toBeInTheDocument();
    expect(screen.getByTestId("site-footer")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
  });

  it("navigates top nav destinations", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: "About" }));
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Careers" }));
    expect(screen.getByRole("heading", { name: "Careers" })).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
  });

  it("navigates footer destinations", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: "Terms and Conditions" }));
    expect(
      screen.getByRole("heading", { name: "Terms and Conditions" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Privacy Policy" }));
    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument();
  });
});
