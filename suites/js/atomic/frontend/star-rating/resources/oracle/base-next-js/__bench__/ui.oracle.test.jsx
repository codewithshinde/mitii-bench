import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("star-rating", () => {
  let user;
  afterEach(() => cleanup());
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("sets selected rating on click", async () => {
    render(<Page />);
    expect(screen.getByTestId("selected-rating")).toHaveTextContent("0");
    await user.click(screen.getByTestId("star-4"));
    expect(screen.getByTestId("selected-rating")).toHaveTextContent("4");
  });

  it("highlights on hover", () => {
    render(<Page />);
    const star3 = screen.getByTestId("star-3");
    fireEvent.mouseEnter(star3);
    expect(star3.getAttribute("style") || "").toMatch(/gold/i);
    fireEvent.mouseLeave(star3);
    expect(star3.getAttribute("style") || "").toMatch(/#ccc|rgb\(204,\s*204,\s*204\)/i);
  });
});
