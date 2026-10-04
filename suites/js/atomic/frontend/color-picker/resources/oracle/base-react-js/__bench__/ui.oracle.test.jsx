import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("color-picker", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("updates preview from swatch and hex input", async () => {
    render(<App />);
    const preview = screen.getByTestId("color-preview");
    expect(preview).toHaveStyle({ background: "#ff0000" });
    await user.click(screen.getByTestId("swatch-#00aa00"));
    expect(preview).toHaveStyle({ background: "#00aa00" });
    expect(screen.getByTestId("hex-input")).toHaveValue("#00aa00");
    await user.clear(screen.getByTestId("hex-input"));
    await user.type(screen.getByTestId("hex-input"), "#0066ff");
    expect(preview).toHaveStyle({ background: "#0066ff" });
  });
});
