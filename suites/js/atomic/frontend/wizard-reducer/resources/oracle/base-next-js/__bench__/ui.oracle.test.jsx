import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("wizard-reducer", () => {
  it("starts at step 1 of 4", () => {
    render(<Page />);
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
  });

  it("advances with next and retreats with prev", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 2 of 4"
    );
    await user.click(screen.getByTestId("prev-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
  });

  it("clamps at the first and last steps", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("prev-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 4 of 4"
    );
    await user.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 4 of 4"
    );
  });

  it("resets to step 1", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
  });
});
