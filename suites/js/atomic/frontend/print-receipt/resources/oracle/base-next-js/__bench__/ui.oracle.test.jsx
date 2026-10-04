import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("print-receipt", () => {
  let printSpy;
  beforeEach(() => {
    printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    printSpy.mockRestore();
  });

  it("renders invoice and triggers window.print", async () => {
    const user = userEvent.setup();
    render(<Page />);
    expect(screen.getByTestId("invoice-view")).toHaveTextContent("Invoice");
    await user.click(screen.getByTestId("print-btn"));
    expect(printSpy).toHaveBeenCalled();
  });
});
