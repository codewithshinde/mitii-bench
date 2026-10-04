import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("password-strength", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("rates weak, medium, and strong passwords", async () => {
    render(<Page />);
    const input = screen.getByTestId("password-input");
    const meter = screen.getByTestId("strength-meter");
    await user.type(input, "ab");
    expect(meter).toHaveTextContent("Weak");
    await user.clear(input);
    await user.type(input, "abcdefgh1");
    expect(meter).toHaveTextContent("Medium");
    await user.clear(input);
    await user.type(input, "abcdefghij1!");
    expect(meter).toHaveTextContent("Strong");
  });
});
