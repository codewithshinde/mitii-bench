import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("credit-card-visual", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("mirrors card number and expiry on the visual card", async () => {
    render(<App />);
    await user.type(screen.getByLabelText(/Card Number/i), "4111111111111111");
    await user.type(screen.getByLabelText(/Expiry/i), "12/30");
    const card = screen.getByTestId("visual-card");
    expect(card).toHaveTextContent("4111");
    expect(card).toHaveTextContent("12/30");
  });

  it("flips to show CVV when focusing CVV field", async () => {
    render(<App />);
    await user.click(screen.getByLabelText(/CVV/i));
    await user.type(screen.getByLabelText(/CVV/i), "123");
    expect(screen.getByTestId("visual-card")).toHaveTextContent("123");
  });
});
