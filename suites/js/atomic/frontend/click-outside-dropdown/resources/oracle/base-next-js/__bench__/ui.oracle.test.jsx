import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("click-outside-dropdown", () => {
  it("renders the dropdown open initially", () => {
    render(<Page />);
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("closes when clicking outside via document fireEvent", () => {
    render(<Page />);
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("stays open when clicking inside the menu", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("dropdown-menu"));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("can reopen after outside click", async () => {
    const user = userEvent.setup();
    render(<Page />);
    fireEvent.click(document.body);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });
});
