import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("infinite-scroll-feed", () => {
  let observe;
  let disconnect;
  let callback;

  beforeEach(() => {
    observe = vi.fn();
    disconnect = vi.fn();
    callback = null;
    class MockIO {
      constructor(cb) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
    }
    vi.stubGlobal("IntersectionObserver", MockIO);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders initial feed items and observes sentinel", () => {
    render(<Page />);
    const feed = screen.getByTestId("infinite-feed");
    expect(feed).toHaveTextContent("Item 1");
    expect(feed).toHaveTextContent("Item 10");
    expect(observe).toHaveBeenCalled();
  });

  it("appends 10 more items when intersecting", async () => {
    render(<Page />);
    callback([{ isIntersecting: true }]);
    await waitFor(() => {
      expect(screen.getByTestId("infinite-feed")).toHaveTextContent("Item 20");
    });
  });
});
