import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("memo-prime-calculator", () => {
  it("reports prime for a prime number", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("number-input");
    await user.clear(input);
    await user.type(input, "7");
    expect(screen.getByTestId("prime-result")).toHaveTextContent("prime");
  });

  it("reports not prime for a composite number", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("number-input");
    await user.clear(input);
    await user.type(input, "8");
    expect(screen.getByTestId("prime-result")).toHaveTextContent("not prime");
  });

  it("reports not prime for numbers below 2", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("number-input");
    await user.clear(input);
    await user.type(input, "1");
    expect(screen.getByTestId("prime-result")).toHaveTextContent("not prime");
  });
});
