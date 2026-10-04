import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("callback-memo-child", () => {
  it("renders parent count and child button", () => {
    render(<Page />);
    expect(screen.getByTestId("parent-count")).toHaveTextContent("0");
    expect(screen.getByTestId("child-action-btn")).toBeInTheDocument();
  });

  it("updates parent count independently of child clicks", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByRole("button", { name: /inc parent/i }));
    expect(screen.getByTestId("parent-count")).toHaveTextContent("1");
    expect(screen.getByTestId("child-action-btn")).toBeInTheDocument();
  });

  it("invokes the memoized child callback", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByTestId("child-action-btn"));
    await user.click(screen.getByTestId("child-action-btn"));
    expect(screen.getByText(/child clicks:\s*2/i)).toBeInTheDocument();
  });
});
