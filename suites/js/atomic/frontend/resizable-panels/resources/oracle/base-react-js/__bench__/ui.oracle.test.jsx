import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("resizable-panels", () => {
  afterEach(() => cleanup());
  it("renders panels and adjusts widths while dragging the handle", () => {
    render(<App />);
    const left = screen.getByTestId("left-panel");
    const right = screen.getByTestId("right-panel");
    const handle = screen.getByTestId("resize-handle");
    expect(left).toBeInTheDocument();
    expect(right).toBeInTheDocument();
    const box = left.parentElement;
    box.getBoundingClientRect = () => ({ left: 0, width: 400, top: 0, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON() {} });
    fireEvent.mouseDown(handle, { clientX: 160 });
    fireEvent.mouseMove(window, { clientX: 280 });
    fireEvent.mouseUp(window);
    expect(left.style.width).toBe("70%");
    expect(right.style.width).toBe("30%");
  });
});
