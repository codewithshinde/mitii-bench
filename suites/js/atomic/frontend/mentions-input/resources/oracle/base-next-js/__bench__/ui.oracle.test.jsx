import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("mentions-input", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("shows mention dropdown after typing @ and inserts selection", async () => {
    render(<Page />);
    const input = screen.getByTestId("mention-input");
    await user.type(input, "Hi @al");
    const dropdown = screen.getByTestId("mention-dropdown");
    expect(within(dropdown).getByText("@alice")).toBeInTheDocument();
    await user.click(within(dropdown).getByText("@alice"));
    expect(input.value).toMatch(/@alice/);
    expect(screen.queryByTestId("mention-dropdown")).not.toBeInTheDocument();
  });
});
