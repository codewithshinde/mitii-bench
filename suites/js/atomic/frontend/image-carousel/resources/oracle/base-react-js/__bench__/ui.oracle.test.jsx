import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("image-carousel", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("cycles next and prev and updates image", async () => {
    render(<App />);
    const img = screen.getByTestId("carousel-image");
    const first = img.getAttribute("src");
    await user.click(screen.getByTestId("carousel-next"));
    expect(img.getAttribute("src")).not.toBe(first);
    await user.click(screen.getByTestId("carousel-prev"));
    expect(img.getAttribute("src")).toBe(first);
  });

  it("jumps via indicator dots and marks current", async () => {
    render(<App />);
    await user.click(screen.getByTestId("carousel-dot-2"));
    expect(screen.getByTestId("carousel-dot-2")).toHaveAttribute("aria-current", "true");
    expect(screen.getByTestId("carousel-image")).toHaveAttribute("alt", "Slide 3");
  });
});
