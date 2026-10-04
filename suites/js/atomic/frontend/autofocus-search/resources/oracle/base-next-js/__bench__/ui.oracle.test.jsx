import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("autofocus-search", () => {
  it("focuses the search input when focus button is clicked", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const input = screen.getByTestId("search-input");
    expect(input).not.toHaveFocus();
    await user.click(screen.getByTestId("focus-btn"));
    expect(input).toHaveFocus();
  });
});
