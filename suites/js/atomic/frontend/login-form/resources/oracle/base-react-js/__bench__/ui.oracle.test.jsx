import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("login-form", () => {
  it("shows error when fields are empty", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-status")).toHaveTextContent(
      "Please fill all fields"
    );
  });

  it("shows error when only email is filled", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("email-input"), "a@b.com");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-status")).toHaveTextContent(
      "Please fill all fields"
    );
  });

  it("shows welcome message on valid submit", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("email-input"), "ada@example.com");
    await user.type(screen.getByTestId("password-input"), "secret");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-status")).toHaveTextContent(
      "Welcome, ada@example.com"
    );
  });

  it("keeps form elements mounted", () => {
    render(<App />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });
});
