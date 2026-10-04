import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("modal-children", () => {
  it("renders title and children in the modal", () => {
    render(<App />);
    expect(screen.getByTestId("modal-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Hello");
    expect(screen.getByTestId("modal-body")).toHaveTextContent(
      "Modal body content"
    );
  });

  it("closes when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("modal-close-btn"));
    expect(screen.queryByTestId("modal-wrapper")).not.toBeInTheDocument();
  });

  it("can reopen after closing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("modal-close-btn"));
    await user.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByTestId("modal-wrapper")).toBeInTheDocument();
  });
});
