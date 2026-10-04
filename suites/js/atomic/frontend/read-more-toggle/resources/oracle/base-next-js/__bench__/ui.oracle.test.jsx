import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("read-more-toggle", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("truncates by default and expands/collapses text", async () => {
    render(<Page />);
    const block = screen.getByTestId("text-block");
    const btn = screen.getByTestId("toggle-read-more");
    expect(btn).toHaveTextContent("Read More");
    expect(block.textContent.length).toBeLessThanOrEqual(101);
    await user.click(btn);
    expect(btn).toHaveTextContent("Read Less");
    expect(block.textContent.length).toBeGreaterThan(100);
    await user.click(btn);
    expect(btn).toHaveTextContent("Read More");
  });
});
