import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("with-authorization-hoc", () => {
  it("shows dashboard for admin role", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-view")).toHaveTextContent(
      "Admin Dashboard"
    );
    expect(screen.queryByTestId("unauthorized-msg")).not.toBeInTheDocument();
  });

  it("shows unauthorized message for non-admin role", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByRole("combobox"), "user");
    expect(screen.getByTestId("unauthorized-msg")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-view")).not.toBeInTheDocument();
  });

  it("restores dashboard when switching back to admin", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByRole("combobox"), "user");
    await user.selectOptions(screen.getByRole("combobox"), "admin");
    expect(screen.getByTestId("dashboard-view")).toBeInTheDocument();
  });
});
