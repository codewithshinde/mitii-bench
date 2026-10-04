import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("rich-text-toolbar", () => {
  beforeEach(() => {
    document.execCommand = vi.fn(() => true);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders editor and formatting buttons that call execCommand", () => {
    render(<Page />);
    expect(screen.getByTestId("editor-area")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("btn-bold"));
    expect(document.execCommand).toHaveBeenCalledWith("bold", false, null);
    fireEvent.mouseDown(screen.getByTestId("btn-italic"));
    expect(document.execCommand).toHaveBeenCalledWith("italic", false, null);
    fireEvent.mouseDown(screen.getByTestId("btn-underline"));
    expect(document.execCommand).toHaveBeenCalledWith("underline", false, null);
  });
});
