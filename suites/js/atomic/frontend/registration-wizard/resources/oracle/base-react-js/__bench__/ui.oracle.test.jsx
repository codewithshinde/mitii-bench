import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("registration-wizard", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("walks through steps and preserves values in summary", async () => {
    render(<App />);
    expect(screen.getByTestId("wizard-back")).toBeDisabled();
    await user.type(screen.getByLabelText(/Name/i), "Ada");
    await user.type(screen.getByLabelText(/Email/i), "ada@ex.com");
    await user.click(screen.getByTestId("wizard-next"));
    await user.type(screen.getByLabelText(/Username/i), "ada");
    await user.type(screen.getByLabelText(/Password/i), "secret");
    await user.click(screen.getByTestId("wizard-next"));
    expect(screen.getByTestId("wizard-next")).toBeDisabled();
    const summary = screen.getByTestId("wizard-summary");
    expect(summary).toHaveTextContent("Ada");
    expect(summary).toHaveTextContent("ada@ex.com");
    expect(summary).toHaveTextContent("ada");
  });

  it("goes back and keeps earlier inputs", async () => {
    render(<App />);
    await user.type(screen.getByLabelText(/Name/i), "Lin");
    await user.click(screen.getByTestId("wizard-next"));
    await user.click(screen.getByTestId("wizard-back"));
    expect(screen.getByLabelText(/Name/i)).toHaveValue("Lin");
  });
});
