import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("markdown-previewer", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders headings, bold, and lists in preview", async () => {
    render(<Page />);
    const preview = screen.getByTestId("markdown-preview");
    expect(preview.querySelector("h1")).toHaveTextContent("Hello");
    expect(preview.querySelector("strong")).toHaveTextContent("Bold");
    expect(preview.querySelectorAll("li").length).toBeGreaterThan(0);
  });

  it("updates preview as user types", async () => {
    render(<Page />);
    const input = screen.getByTestId("markdown-input");
    await user.clear(input);
    await user.type(input, "# Title{Enter}{Enter}**Wow**");
    const preview = screen.getByTestId("markdown-preview");
    expect(preview.querySelector("h1")).toHaveTextContent("Title");
    expect(preview.querySelector("strong")).toHaveTextContent("Wow");
  });
});
