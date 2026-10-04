import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("custom-select-search", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens options, filters, and selects a value", async () => {
    render(<App />);
    await user.click(screen.getByTestId("custom-select-trigger"));
    expect(screen.getByTestId("custom-select-options")).toBeInTheDocument();
    await user.type(screen.getByTestId("custom-select-search"), "vu");
    const options = screen.getByTestId("custom-select-options");
    expect(within(options).getByText("Vue")).toBeInTheDocument();
    expect(within(options).queryByText("React")).not.toBeInTheDocument();
    await user.click(within(options).getByText("Vue"));
    expect(screen.getByTestId("custom-select-trigger")).toHaveTextContent("Vue");
    expect(screen.queryByTestId("custom-select-options")).not.toBeInTheDocument();
  });
});
