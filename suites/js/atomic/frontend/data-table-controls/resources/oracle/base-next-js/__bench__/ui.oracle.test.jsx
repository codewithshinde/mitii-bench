import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("data-table-controls", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("shows page indicator and paginates", async () => {
    render(<Page />);
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 5");
    await user.click(screen.getByTestId("next-page"));
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 2 of 5");
    await user.click(screen.getByTestId("prev-page"));
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 5");
  });

  it("filters with search and resets page", async () => {
    render(<Page />);
    await user.click(screen.getByTestId("next-page"));
    await user.type(screen.getByTestId("table-search"), "User 1");
    expect(screen.getByTestId("page-indicator")).toHaveTextContent(/Page 1 of/);
    expect(screen.getByText("User 1")).toBeInTheDocument();
  });

  it("changes page size", async () => {
    render(<Page />);
    await user.selectOptions(screen.getByTestId("page-size-select"), "20");
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 3");
  });
});
