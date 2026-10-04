import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("select-all-checkboxes", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("selects and clears all items from the master checkbox", async () => {
    render(<Page />);
    const selectAll = screen.getByTestId("select-all-checkbox");
    await user.click(selectAll);
    for (const id of ["a", "b", "c", "d"]) {
      expect(screen.getByTestId("item-checkbox-" + id)).toBeChecked();
    }
    await user.click(selectAll);
    for (const id of ["a", "b", "c", "d"]) {
      expect(screen.getByTestId("item-checkbox-" + id)).not.toBeChecked();
    }
  });

  it("checks select-all when every item is checked", async () => {
    render(<Page />);
    for (const id of ["a", "b", "c", "d"]) {
      await user.click(screen.getByTestId("item-checkbox-" + id));
    }
    expect(screen.getByTestId("select-all-checkbox")).toBeChecked();
  });
});
