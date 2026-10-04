import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("uncontrolled-file-upload", () => {
  it("displays selected file name after submit", async () => {
    const user = userEvent.setup();
    render(<App />);
    const file = new File(["hello"], "report.pdf", {
      type: "application/pdf",
    });
    await user.upload(screen.getByTestId("file-input"), file);
    await user.click(screen.getByTestId("upload-btn"));
    expect(screen.getByTestId("file-name-display")).toHaveTextContent(
      "report.pdf"
    );
  });

  it("keeps display empty when submitting without a file", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("upload-btn"));
    expect(screen.getByTestId("file-name-display")).toHaveTextContent("");
  });
});
