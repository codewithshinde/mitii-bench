import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("dynamic-item-list", () => {
  it("starts with an empty list", () => {
    render(<App />);
    expect(screen.getByTestId("item-list")).toBeInTheDocument();
    expect(screen.queryByTestId("item-row-0")).not.toBeInTheDocument();
  });

  it("adds a non-empty item", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("item-input"), "Apples");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("item-row-0")).toHaveTextContent("Apples");
  });

  it("rejects empty and whitespace-only items", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("item-row-0")).not.toBeInTheDocument();
    await user.type(screen.getByTestId("item-input"), "   ");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("item-row-0")).not.toBeInTheDocument();
  });

  it("appends multiple items with sequential test ids", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("item-input"), "One");
    await user.click(screen.getByTestId("add-btn"));
    await user.type(screen.getByTestId("item-input"), "Two");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("item-row-0")).toHaveTextContent("One");
    expect(screen.getByTestId("item-row-1")).toHaveTextContent("Two");
  });
});
