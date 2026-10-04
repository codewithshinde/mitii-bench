import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("date-range-picker", () => {
  afterEach(() => cleanup());
  it("shows error when end date is before start date", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("start-date"), { target: { value: "2024-06-10" } });
    fireEvent.change(screen.getByTestId("end-date"), { target: { value: "2024-06-01" } });
    expect(screen.getByTestId("date-error")).toHaveTextContent(/prior/i);
  });

  it("hides error for a valid range", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("start-date"), { target: { value: "2024-06-01" } });
    fireEvent.change(screen.getByTestId("end-date"), { target: { value: "2024-06-10" } });
    expect(screen.queryByTestId("date-error")).not.toBeInTheDocument();
  });
});
