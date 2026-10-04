import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("document-title-sync", () => {
  afterEach(() => {
    document.title = "";
  });

  it("updates document.title as the user types", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("title-input");
    await user.clear(input);
    await user.type(input, "Bench Title");
    expect(document.title).toBe("Bench Title");
  });

  it("reflects each keystroke in document.title", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("title-input"), "Hi");
    expect(document.title).toBe("Hi");
  });
});
