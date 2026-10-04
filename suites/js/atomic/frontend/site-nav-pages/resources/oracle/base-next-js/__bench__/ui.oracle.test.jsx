import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteChrome } from "../components/SiteChrome.jsx";

afterEach(() => cleanup());

describe("site-nav-pages (next chrome)", () => {
  it("renders brand, main nav, and footer labels", () => {
    render(
      <SiteChrome>
        <h1>Home</h1>
      </SiteChrome>,
    );
    expect(screen.getByText("BenchApp")).toBeInTheDocument();
    expect(screen.getByTestId("main-nav")).toBeInTheDocument();
    expect(screen.getByTestId("site-footer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Careers" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms and Conditions" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
  });
});
