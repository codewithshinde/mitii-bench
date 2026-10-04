import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("portal-tooltip", () => {
  beforeEach(() => {
    const root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.getElementById("modal-root")?.remove();
  });

  it("renders tooltip into #modal-root on hover", async () => {
    render(<Page />);
    // Wait for useEffect to capture modal-root
    await waitFor(() => {
      fireEvent.mouseEnter(screen.getByTestId("tooltip-target"));
      expect(screen.getByTestId("portal-tooltip")).toBeInTheDocument();
    });
    const modalRoot = document.getElementById("modal-root");
    expect(modalRoot.contains(screen.getByTestId("portal-tooltip"))).toBe(true);
  });

  it("hides tooltip on mouse leave", async () => {
    render(<Page />);
    const target = screen.getByTestId("tooltip-target");
    await waitFor(() => {
      fireEvent.mouseEnter(target);
      expect(screen.getByTestId("portal-tooltip")).toBeInTheDocument();
    });
    fireEvent.mouseLeave(target);
    expect(screen.queryByTestId("portal-tooltip")).not.toBeInTheDocument();
  });
});
