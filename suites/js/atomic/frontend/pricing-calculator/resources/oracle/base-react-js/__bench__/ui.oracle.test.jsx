import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("pricing-calculator", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("calculates monthly and yearly prices from the slider", async () => {
    render(<App />);
    const slider = screen.getByTestId("user-slider");
    fireEvent.change(slider, { target: { value: "10" } });
    expect(screen.getByTestId("calculated-price")).toHaveTextContent("$100");
    await user.click(screen.getByTestId("billing-toggle"));
    expect(screen.getByTestId("billing-toggle")).toBeChecked();
    expect(screen.getByTestId("calculated-price")).toHaveTextContent("$960");
  });
});
