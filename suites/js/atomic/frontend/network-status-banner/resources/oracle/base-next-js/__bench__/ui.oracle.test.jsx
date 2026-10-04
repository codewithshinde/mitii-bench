import { describe, it, expect, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("network-status-banner", () => {
  afterEach(() => cleanup());
  it("reacts to offline and online window events", () => {
    render(<Page />);
    const banner = screen.getByTestId("network-status-banner");
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(banner).toHaveTextContent("You are offline");
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(banner).toHaveTextContent("Connection restored");
  });
});
