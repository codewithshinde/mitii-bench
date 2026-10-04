import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("nested-comments", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders root comment and posts a nested reply", async () => {
    render(<App />);
    expect(screen.getByTestId("comment-c1")).toHaveTextContent("Root comment");
    await user.click(screen.getByTestId("reply-btn-c1"));
    const root = screen.getByTestId("comment-c1");
    const input = within(root).getByRole("textbox");
    await user.type(input, "Child reply");
    await user.click(within(root).getByRole("button", { name: /post/i }));
    expect(screen.getByTestId("comment-c2")).toHaveTextContent("Child reply");
  });
});
