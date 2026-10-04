import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page.jsx";

describe("file-tree-view", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders folders/files and toggles folder children", async () => {
    render(<Page />);
    expect(screen.getByTestId("folder-src")).toBeInTheDocument();
    expect(screen.getByTestId("file-app")).toBeInTheDocument();
    expect(screen.getByTestId("file-readme")).toBeInTheDocument();
    await user.click(screen.getByTestId("folder-src"));
    expect(screen.queryByTestId("file-app")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("folder-src"));
    expect(screen.getByTestId("file-app")).toBeInTheDocument();
  });
});
