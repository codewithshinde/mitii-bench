import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("cart-drawer", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens and closes the cart drawer", async () => {
    render(<Page />);
    expect(screen.queryByTestId("cart-drawer")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("open-cart-btn"));
    expect(screen.getByTestId("cart-drawer")).toBeInTheDocument();
    await user.click(screen.getByTestId("close-cart-btn"));
    expect(screen.queryByTestId("cart-drawer")).not.toBeInTheDocument();
  });
});
