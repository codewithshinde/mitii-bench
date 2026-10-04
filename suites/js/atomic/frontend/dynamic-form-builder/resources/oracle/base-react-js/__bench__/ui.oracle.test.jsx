import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("dynamic-form-builder", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("adds, edits, and removes custom fields", async () => {
    render(<App />);
    expect(screen.getByTestId("custom-field-0")).toBeInTheDocument();
    await user.click(screen.getByTestId("add-field-btn"));
    expect(screen.getByTestId("custom-field-1")).toBeInTheDocument();
    const row = screen.getByTestId("custom-field-1");
    await user.type(within(row).getByPlaceholderText("Label"), "Age");
    await user.selectOptions(within(row).getByRole("combobox"), "Number");
    expect(within(row).getByPlaceholderText("Label")).toHaveValue("Age");
    expect(within(row).getByRole("combobox")).toHaveValue("Number");
    await user.click(within(row).getByRole("button", { name: /remove/i }));
    expect(screen.queryByTestId("custom-field-1")).not.toBeInTheDocument();
  });
});
