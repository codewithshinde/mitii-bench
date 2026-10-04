import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("user-profile-card", () => {
  it("renders user card with name, role, and avatar", () => {
    userEvent.setup();
    render(<App />);
    expect(screen.getByTestId("user-card")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toHaveTextContent("Ada Lovelace");
    expect(screen.getByTestId("user-role")).toHaveTextContent("Engineer");
    expect(screen.getByTestId("user-avatar")).toHaveAttribute(
      "src",
      "https://example.com/ada.png"
    );
  });
});
