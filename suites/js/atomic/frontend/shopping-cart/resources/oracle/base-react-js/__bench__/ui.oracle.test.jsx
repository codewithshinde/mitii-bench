import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("shopping-cart", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("updates line totals and grand total on quantity change", async () => {
    render(<App />);
    expect(screen.getByTestId("cart-item-a1")).toBeInTheDocument();
    expect(screen.getByTestId("line-total-a1")).toHaveTextContent("10");
    expect(screen.getByTestId("line-total-b2")).toHaveTextContent("50");
    expect(screen.getByTestId("grand-total")).toHaveTextContent("60");
    await user.click(screen.getByTestId("inc-a1"));
    expect(screen.getByTestId("line-total-a1")).toHaveTextContent("20");
    expect(screen.getByTestId("grand-total")).toHaveTextContent("70");
    await user.click(screen.getByTestId("dec-b2"));
    expect(screen.getByTestId("line-total-b2")).toHaveTextContent("25");
    expect(screen.getByTestId("grand-total")).toHaveTextContent("45");
  });
});
