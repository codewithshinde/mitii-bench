import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("forward-ref-input", () => {
  it("focuses FancyInput when parent button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("fancy-input");
    expect(input).not.toHaveFocus();
    await user.click(screen.getByTestId("parent-focus-btn"));
    expect(input).toHaveFocus();
  });
});
