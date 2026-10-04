import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("forward-ref-input", () => {
  it("focuses FancyInput when parent button is clicked", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const input = screen.getByTestId("fancy-input");
    expect(input).not.toHaveFocus();
    await user.click(screen.getByTestId("parent-focus-btn"));
    expect(input).toHaveFocus();
  });
});
