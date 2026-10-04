import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("faq-accordion", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens one panel at a time and can collapse", async () => {
    render(<Page />);
    expect(screen.queryByTestId("accordion-panel-1")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("accordion-header-1"));
    expect(screen.getByTestId("accordion-panel-1")).toBeInTheDocument();
    await user.click(screen.getByTestId("accordion-header-2"));
    expect(screen.queryByTestId("accordion-panel-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("accordion-panel-2")).toBeInTheDocument();
    await user.click(screen.getByTestId("accordion-header-2"));
    expect(screen.queryByTestId("accordion-panel-2")).not.toBeInTheDocument();
  });
});
