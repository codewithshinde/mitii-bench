import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Page from "../app/page.jsx";

describe("file-dropzone", () => {
  afterEach(() => cleanup());
  it("adds active class on drag over and clears on leave", () => {
    render(<Page />);
    const zone = screen.getByTestId("dropzone");
    fireEvent.dragOver(zone, { dataTransfer: { files: [] } });
    expect(zone).toHaveClass("active");
    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveClass("active");
  });

  it("lists dropped file names and sizes in KB", () => {
    render(<Page />);
    const zone = screen.getByTestId("dropzone");
    const file = new File(["hello world"], "note.txt", { type: "text/plain" });
    Object.defineProperty(file, "size", { value: 2048 });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByTestId("uploaded-file-list")).toHaveTextContent("note.txt");
    expect(screen.getByTestId("uploaded-file-list")).toHaveTextContent("KB");
  });
});
