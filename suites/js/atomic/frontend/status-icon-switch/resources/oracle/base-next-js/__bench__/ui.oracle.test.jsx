import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("status-icon-switch", () => {
  it("renders success icon by default", () => {
    render(<Page />);
    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("success")).toBeInTheDocument();
  });

  it("switches icon when type changes", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "warning");
    expect(screen.getByLabelText("warning")).toBeInTheDocument();
    await user.selectOptions(select, "error");
    expect(screen.getByLabelText("error")).toBeInTheDocument();
    await user.selectOptions(select, "success");
    expect(screen.getByLabelText("success")).toBeInTheDocument();
  });
});
