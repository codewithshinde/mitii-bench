import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("audio-player-ui", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
  });

  it("toggles play/pause label and shows progress and time", async () => {
    render(<Page />);
    const btn = screen.getByTestId("play-pause-btn");
    expect(btn).toHaveTextContent("Play");
    expect(screen.getByTestId("audio-progress")).toBeInTheDocument();
    expect(screen.getByTestId("time-display")).toHaveTextContent(/\d{2}:\d{2}/);
    await user.click(btn);
    expect(btn).toHaveTextContent("Pause");
    await user.click(btn);
    expect(btn).toHaveTextContent("Play");
  });
});
