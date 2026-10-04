import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("image-zoomer", () => {
  afterEach(() => cleanup());
  it("shows zoom preview under the cursor and hides on leave", () => {
    render(<Page />);
    const img = screen.getByTestId("product-image");
    img.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 300, right: 300, bottom: 300, x: 0, y: 0, toJSON() {} });
    expect(screen.queryByTestId("zoom-preview")).not.toBeInTheDocument();
    fireEvent.mouseMove(img, { clientX: 75, clientY: 150 });
    const preview = screen.getByTestId("zoom-preview");
    expect(preview).toHaveStyle({ backgroundPosition: "25% 50%" });
    fireEvent.mouseLeave(img);
    expect(screen.queryByTestId("zoom-preview")).not.toBeInTheDocument();
  });
});
