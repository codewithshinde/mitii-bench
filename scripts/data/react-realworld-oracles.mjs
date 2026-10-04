// Auto-generated React real-world UI oracles (__bench__/ui.oracle.test.jsx bodies).
// Keys match scripts/data/react-realworld-cases.mjs slugs.

export const realworldOracles = {
  "todo-crud": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("todo-crud", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("adds todos to the list", async () => {
    render(<App />);
    await user.type(screen.getByTestId("todo-input"), "Buy milk");
    await user.click(screen.getByTestId("add-todo-btn"));
    expect(within(screen.getByTestId("todo-list")).getByText("Buy milk")).toBeInTheDocument();
  });

  it("toggles complete via checkbox", async () => {
    render(<App />);
    await user.type(screen.getByTestId("todo-input"), "Task");
    await user.click(screen.getByTestId("add-todo-btn"));
    const check = screen.getByTestId("todo-check-1");
    expect(check).not.toBeChecked();
    await user.click(check);
    expect(check).toBeChecked();
  });

  it("deletes a todo", async () => {
    render(<App />);
    await user.type(screen.getByTestId("todo-input"), "Temp");
    await user.click(screen.getByTestId("add-todo-btn"));
    await user.click(screen.getByTestId("todo-delete-1"));
    expect(screen.queryByText("Temp")).not.toBeInTheDocument();
  });

  it("edits on double-click", async () => {
    render(<App />);
    await user.type(screen.getByTestId("todo-input"), "Old");
    await user.click(screen.getByTestId("add-todo-btn"));
    await user.dblClick(screen.getByText("Old"));
    const edit = screen.getByDisplayValue("Old");
    await user.clear(edit);
    await user.type(edit, "New{Enter}");
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
`,
  "debounced-autocomplete": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("debounced-autocomplete", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows suggestions after 300ms debounce", async () => {
    render(<App />);
    await user.type(screen.getByTestId("search-input"), "ap");
    expect(screen.queryByTestId("search-suggestions")).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(300);
    await waitFor(() => {
      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
    });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Apricot")).toBeInTheDocument();
  });

  it("navigates with arrow keys and selects with Enter", async () => {
    render(<App />);
    const input = screen.getByTestId("search-input");
    await user.type(input, "a");
    await vi.advanceTimersByTimeAsync(300);
    await waitFor(() => expect(screen.getByTestId("search-suggestions")).toBeInTheDocument());
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(input).toHaveValue("Apple"));
  });
});
`,
  "registration-wizard": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("registration-wizard", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("walks through steps and preserves values in summary", async () => {
    render(<App />);
    expect(screen.getByTestId("wizard-back")).toBeDisabled();
    await user.type(screen.getByLabelText(/Name/i), "Ada");
    await user.type(screen.getByLabelText(/Email/i), "ada@ex.com");
    await user.click(screen.getByTestId("wizard-next"));
    await user.type(screen.getByLabelText(/Username/i), "ada");
    await user.type(screen.getByLabelText(/Password/i), "secret");
    await user.click(screen.getByTestId("wizard-next"));
    expect(screen.getByTestId("wizard-next")).toBeDisabled();
    const summary = screen.getByTestId("wizard-summary");
    expect(summary).toHaveTextContent("Ada");
    expect(summary).toHaveTextContent("ada@ex.com");
    expect(summary).toHaveTextContent("ada");
  });

  it("goes back and keeps earlier inputs", async () => {
    render(<App />);
    await user.type(screen.getByLabelText(/Name/i), "Lin");
    await user.click(screen.getByTestId("wizard-next"));
    await user.click(screen.getByTestId("wizard-back"));
    expect(screen.getByLabelText(/Name/i)).toHaveValue("Lin");
  });
});
`,
  "data-table-controls": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("data-table-controls", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("shows page indicator and paginates", async () => {
    render(<App />);
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 5");
    await user.click(screen.getByTestId("next-page"));
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 2 of 5");
    await user.click(screen.getByTestId("prev-page"));
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 5");
  });

  it("filters with search and resets page", async () => {
    render(<App />);
    await user.click(screen.getByTestId("next-page"));
    await user.type(screen.getByTestId("table-search"), "User 1");
    expect(screen.getByTestId("page-indicator")).toHaveTextContent(/Page 1 of/);
    expect(screen.getByText("User 1")).toBeInTheDocument();
  });

  it("changes page size", async () => {
    render(<App />);
    await user.selectOptions(screen.getByTestId("page-size-select"), "20");
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 3");
  });
});
`,
  "file-dropzone": `import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("file-dropzone", () => {
  afterEach(() => cleanup());
  it("adds active class on drag over and clears on leave", () => {
    render(<App />);
    const zone = screen.getByTestId("dropzone");
    fireEvent.dragOver(zone, { dataTransfer: { files: [] } });
    expect(zone).toHaveClass("active");
    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveClass("active");
  });

  it("lists dropped file names and sizes in KB", () => {
    render(<App />);
    const zone = screen.getByTestId("dropzone");
    const file = new File(["hello world"], "note.txt", { type: "text/plain" });
    Object.defineProperty(file, "size", { value: 2048 });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByTestId("uploaded-file-list")).toHaveTextContent("note.txt");
    expect(screen.getByTestId("uploaded-file-list")).toHaveTextContent("KB");
  });
});
`,
  "image-carousel": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
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
`,
  "infinite-scroll-feed": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

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
    render(<App />);
    const feed = screen.getByTestId("infinite-feed");
    expect(feed).toHaveTextContent("Item 1");
    expect(feed).toHaveTextContent("Item 10");
    expect(observe).toHaveBeenCalled();
  });

  it("appends 10 more items when intersecting", async () => {
    render(<App />);
    callback([{ isIntersecting: true }]);
    await waitFor(() => {
      expect(screen.getByTestId("infinite-feed")).toHaveTextContent("Item 20");
    });
  });
});
`,
  "accessible-modal": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("accessible-modal", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens modal and closes on Escape", async () => {
    render(<App />);
    expect(screen.queryByTestId("accessible-modal")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /open modal/i }));
    expect(screen.getByTestId("accessible-modal")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("accessible-modal")).not.toBeInTheDocument();
  });

  it("traps focus with Tab between modal buttons", async () => {
    render(<App />);
    await user.click(screen.getByRole("button", { name: /open modal/i }));
    const modal = screen.getByTestId("accessible-modal");
    const action = modal.querySelector("button");
    const close = screen.getByRole("button", { name: /close/i });
    expect(action).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(action).toHaveFocus();
  });
});
`,
  "shopping-cart": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("shopping-cart", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("updates line totals and grand total on quantity change", async () => {
    render(<App />);
    expect(screen.getByTestId("cart-item-a1")).toBeInTheDocument();
    expect(screen.getByTestId("line-total-a1")).toHaveTextContent("10");
    expect(screen.getByTestId("line-total-b2")).toHaveTextContent("50");
    expect(screen.getByTestId("grand-total")).toHaveTextContent("60");
    await user.click(screen.getByTestId("inc-a1"));
    expect(screen.getByTestId("line-total-a1")).toHaveTextContent("20");
    expect(screen.getByTestId("grand-total")).toHaveTextContent("70");
    await user.click(screen.getByTestId("dec-b2"));
    expect(screen.getByTestId("line-total-b2")).toHaveTextContent("25");
    expect(screen.getByTestId("grand-total")).toHaveTextContent("45");
  });
});
`,
  "star-rating": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("star-rating", () => {
  let user;
  afterEach(() => cleanup());
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("sets selected rating on click", async () => {
    render(<App />);
    expect(screen.getByTestId("selected-rating")).toHaveTextContent("0");
    await user.click(screen.getByTestId("star-4"));
    expect(screen.getByTestId("selected-rating")).toHaveTextContent("4");
  });

  it("highlights on hover", () => {
    render(<App />);
    const star3 = screen.getByTestId("star-3");
    fireEvent.mouseEnter(star3);
    expect(star3.getAttribute("style") || "").toMatch(/gold/i);
    fireEvent.mouseLeave(star3);
    expect(star3.getAttribute("style") || "").toMatch(/#ccc|rgb\\(204,\\s*204,\\s*204\\)/i);
  });
});
`,
  "nested-comments": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("nested-comments", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders root comment and posts a nested reply", async () => {
    render(<App />);
    expect(screen.getByTestId("comment-c1")).toHaveTextContent("Root comment");
    await user.click(screen.getByTestId("reply-btn-c1"));
    const root = screen.getByTestId("comment-c1");
    const input = within(root).getByRole("textbox");
    await user.type(input, "Child reply");
    await user.click(within(root).getByRole("button", { name: /post/i }));
    expect(screen.getByTestId("comment-c2")).toHaveTextContent("Child reply");
  });
});
`,
  "kanban-board": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("kanban-board", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders columns and moves cards between them", async () => {
    render(<App />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    const card = screen.getByTestId("task-card-t1");
    expect(card).toHaveTextContent("Design");
    await user.click(within(card).getByRole("button", { name: /move right/i }));
    const moved = screen.getByTestId("task-card-t1");
    expect(within(moved).getByRole("button", { name: /move left/i })).not.toBeDisabled();
    await user.click(within(moved).getByRole("button", { name: /move right/i }));
    expect(within(screen.getByTestId("task-card-t1")).getByRole("button", { name: /move right/i })).toBeDisabled();
  });
});
`,
  "faq-accordion": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("faq-accordion", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens one panel at a time and can collapse", async () => {
    render(<App />);
    expect(screen.queryByTestId("accordion-panel-1")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("accordion-header-1"));
    expect(screen.getByTestId("accordion-panel-1")).toBeInTheDocument();
    await user.click(screen.getByTestId("accordion-header-2"));
    expect(screen.queryByTestId("accordion-panel-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("accordion-panel-2")).toBeInTheDocument();
    await user.click(screen.getByTestId("accordion-header-2"));
    expect(screen.queryByTestId("accordion-panel-2")).not.toBeInTheDocument();
  });
});
`,
  "toast-system": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("toast-system", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows success and error toasts in the container", async () => {
    render(<App />);
    await user.click(screen.getByTestId("btn-toast-success"));
    expect(screen.getByTestId("toast-container")).toHaveTextContent("Success");
    await user.click(screen.getByTestId("btn-toast-error"));
    expect(screen.getByTestId("toast-container")).toHaveTextContent("Error");
  });

  it("auto-dismisses toasts", async () => {
    render(<App />);
    await user.click(screen.getByTestId("btn-toast-success"));
    expect(screen.getByTestId("toast-container")).toHaveTextContent("Success");
    await vi.advanceTimersByTimeAsync(2500);
    await waitFor(() => {
      expect(screen.getByTestId("toast-container")).not.toHaveTextContent("Success");
    });
  });
});
`,
  "markdown-previewer": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("markdown-previewer", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders headings, bold, and lists in preview", async () => {
    render(<App />);
    const preview = screen.getByTestId("markdown-preview");
    expect(preview.querySelector("h1")).toHaveTextContent("Hello");
    expect(preview.querySelector("strong")).toHaveTextContent("Bold");
    expect(preview.querySelectorAll("li").length).toBeGreaterThan(0);
  });

  it("updates preview as user types", async () => {
    render(<App />);
    const input = screen.getByTestId("markdown-input");
    await user.clear(input);
    await user.type(input, "# Title{Enter}{Enter}**Wow**");
    const preview = screen.getByTestId("markdown-preview");
    expect(preview.querySelector("h1")).toHaveTextContent("Title");
    expect(preview.querySelector("strong")).toHaveTextContent("Wow");
  });
});
`,
  "tag-chip-input": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("tag-chip-input", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("creates chips with Enter and comma, and deletes with X", async () => {
    render(<App />);
    const input = screen.getByTestId("chip-input");
    await user.type(input, "react{Enter}");
    expect(screen.getByTestId("chip-react")).toBeInTheDocument();
    await user.type(input, "vite,");
    expect(screen.getByTestId("chip-vite")).toBeInTheDocument();
    await user.click(within(screen.getByTestId("chip-react")).getByRole("button", { name: "X" }));
    expect(screen.queryByTestId("chip-react")).not.toBeInTheDocument();
  });
});
`,
  "otp-inputs": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("otp-inputs", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("has six inputs and advances focus while typing", async () => {
    render(<App />);
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId("otp-input-" + i)).toBeInTheDocument();
    }
    const first = screen.getByTestId("otp-input-0");
    await user.click(first);
    await user.keyboard("1");
    expect(first).toHaveValue("1");
    expect(screen.getByTestId("otp-input-1")).toHaveFocus();
  });

  it("moves focus back on Backspace when empty", async () => {
    render(<App />);
    await user.click(screen.getByTestId("otp-input-0"));
    await user.keyboard("9");
    expect(screen.getByTestId("otp-input-1")).toHaveFocus();
    await user.keyboard("{Backspace}");
    expect(screen.getByTestId("otp-input-0")).toHaveFocus();
  });
});
`,
  "rich-text-toolbar": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("rich-text-toolbar", () => {
  beforeEach(() => {
    document.execCommand = vi.fn(() => true);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders editor and formatting buttons that call execCommand", () => {
    render(<App />);
    expect(screen.getByTestId("editor-area")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("btn-bold"));
    expect(document.execCommand).toHaveBeenCalledWith("bold", false, null);
    fireEvent.mouseDown(screen.getByTestId("btn-italic"));
    expect(document.execCommand).toHaveBeenCalledWith("italic", false, null);
    fireEvent.mouseDown(screen.getByTestId("btn-underline"));
    expect(document.execCommand).toHaveBeenCalledWith("underline", false, null);
  });
});
`,
  "theme-switch-dark": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("theme-switch-dark", () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove("dark");
  });

  it("toggles dark class on body and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByTestId("theme-switch");
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(document.body.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    await user.click(toggle);
    expect(document.body.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("restores dark preference from localStorage", async () => {
    localStorage.setItem("theme", "dark");
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("theme-switch")).toBeChecked();
      expect(document.body.classList.contains("dark")).toBe(true);
    });
  });
});
`,
  "breadcrumb-nav": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("breadcrumb-nav", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("shows path segments and updates when navigating", async () => {
    render(<App />);
    const nav = screen.getByTestId("breadcrumb-nav");
    expect(nav).toHaveTextContent("Home");
    expect(nav).toHaveTextContent("Products");
    expect(nav).toHaveTextContent("Electronics");
    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByTestId("breadcrumb-nav")).toHaveTextContent("Home");
    expect(screen.getByTestId("breadcrumb-nav")).not.toHaveTextContent("Electronics");
    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.getByTestId("breadcrumb-nav")).toHaveTextContent("Products");
  });
});
`,
  "date-range-picker": `import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("date-range-picker", () => {
  afterEach(() => cleanup());
  it("shows error when end date is before start date", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("start-date"), { target: { value: "2024-06-10" } });
    fireEvent.change(screen.getByTestId("end-date"), { target: { value: "2024-06-01" } });
    expect(screen.getByTestId("date-error")).toHaveTextContent(/prior/i);
  });

  it("hides error for a valid range", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("start-date"), { target: { value: "2024-06-01" } });
    fireEvent.change(screen.getByTestId("end-date"), { target: { value: "2024-06-10" } });
    expect(screen.queryByTestId("date-error")).not.toBeInTheDocument();
  });
});
`,
  "polling-status": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("polling-status", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows a Healthy or Unreachable status", async () => {
    render(<App />);
    await waitFor(() => {
      const text = screen.getByTestId("server-status").textContent;
      expect(["Healthy", "Unreachable"]).toContain(text);
    });
  });

  it("pauses and resumes polling via toggle", async () => {
    render(<App />);
    const btn = screen.getByTestId("pause-polling-btn");
    expect(btn).toHaveTextContent(/pause/i);
    await user.click(btn);
    expect(btn).toHaveTextContent(/resume/i);
    await user.click(btn);
    expect(btn).toHaveTextContent(/pause/i);
  });

  it("polls on an interval while active", async () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.9);
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("server-status")).toHaveTextContent("Healthy"));
    spy.mockReturnValue(0.05);
    await vi.advanceTimersByTimeAsync(5000);
    await waitFor(() => expect(screen.getByTestId("server-status")).toHaveTextContent("Unreachable"));
    spy.mockRestore();
  });
});
`,
  "copy-clipboard": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("copy-clipboard", () => {
  let user;
  let writeText;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("copies code block contents and shows temporary feedback", async () => {
    render(<App />);
    expect(screen.getByTestId("code-block")).toHaveTextContent("console.log");
    const btn = screen.getByTestId("copy-btn");
    expect(btn).toHaveTextContent("Copy");
    await user.click(btn);
    expect(writeText).toHaveBeenCalled();
    expect(btn).toHaveTextContent("Copied!");
    await vi.advanceTimersByTimeAsync(2000);
    await waitFor(() => expect(btn).toHaveTextContent("Copy"));
  });
});
`,
  "custom-select-search": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("custom-select-search", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens options, filters, and selects a value", async () => {
    render(<App />);
    await user.click(screen.getByTestId("custom-select-trigger"));
    expect(screen.getByTestId("custom-select-options")).toBeInTheDocument();
    await user.type(screen.getByTestId("custom-select-search"), "vu");
    const options = screen.getByTestId("custom-select-options");
    expect(within(options).getByText("Vue")).toBeInTheDocument();
    expect(within(options).queryByText("React")).not.toBeInTheDocument();
    await user.click(within(options).getByText("Vue"));
    expect(screen.getByTestId("custom-select-trigger")).toHaveTextContent("Vue");
    expect(screen.queryByTestId("custom-select-options")).not.toBeInTheDocument();
  });
});
`,
  "color-picker": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("color-picker", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("updates preview from swatch and hex input", async () => {
    render(<App />);
    const preview = screen.getByTestId("color-preview");
    expect(preview).toHaveStyle({ background: "#ff0000" });
    await user.click(screen.getByTestId("swatch-#00aa00"));
    expect(preview).toHaveStyle({ background: "#00aa00" });
    expect(screen.getByTestId("hex-input")).toHaveValue("#00aa00");
    await user.clear(screen.getByTestId("hex-input"));
    await user.type(screen.getByTestId("hex-input"), "#0066ff");
    expect(preview).toHaveStyle({ background: "#0066ff" });
  });
});
`,
  "audio-player-ui": `import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("audio-player-ui", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
  });

  it("toggles play/pause label and shows progress and time", async () => {
    render(<App />);
    const btn = screen.getByTestId("play-pause-btn");
    expect(btn).toHaveTextContent("Play");
    expect(screen.getByTestId("audio-progress")).toBeInTheDocument();
    expect(screen.getByTestId("time-display")).toHaveTextContent(/\\d{2}:\\d{2}/);
    await user.click(btn);
    expect(btn).toHaveTextContent("Pause");
    await user.click(btn);
    expect(btn).toHaveTextContent("Play");
  });
});
`,
  "password-strength": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("password-strength", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("rates weak, medium, and strong passwords", async () => {
    render(<App />);
    const input = screen.getByTestId("password-input");
    const meter = screen.getByTestId("strength-meter");
    await user.type(input, "ab");
    expect(meter).toHaveTextContent("Weak");
    await user.clear(input);
    await user.type(input, "abcdefgh1");
    expect(meter).toHaveTextContent("Medium");
    await user.clear(input);
    await user.type(input, "abcdefghij1!");
    expect(meter).toHaveTextContent("Strong");
  });
});
`,
  "select-all-checkboxes": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("select-all-checkboxes", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("selects and clears all items from the master checkbox", async () => {
    render(<App />);
    const selectAll = screen.getByTestId("select-all-checkbox");
    await user.click(selectAll);
    for (const id of ["a", "b", "c", "d"]) {
      expect(screen.getByTestId("item-checkbox-" + id)).toBeChecked();
    }
    await user.click(selectAll);
    for (const id of ["a", "b", "c", "d"]) {
      expect(screen.getByTestId("item-checkbox-" + id)).not.toBeChecked();
    }
  });

  it("checks select-all when every item is checked", async () => {
    render(<App />);
    for (const id of ["a", "b", "c", "d"]) {
      await user.click(screen.getByTestId("item-checkbox-" + id));
    }
    expect(screen.getByTestId("select-all-checkbox")).toBeChecked();
  });
});
`,
  "read-more-toggle": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("read-more-toggle", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("truncates by default and expands/collapses text", async () => {
    render(<App />);
    const block = screen.getByTestId("text-block");
    const btn = screen.getByTestId("toggle-read-more");
    expect(btn).toHaveTextContent("Read More");
    expect(block.textContent.length).toBeLessThanOrEqual(101);
    await user.click(btn);
    expect(btn).toHaveTextContent("Read Less");
    expect(block.textContent.length).toBeGreaterThan(100);
    await user.click(btn);
    expect(btn).toHaveTextContent("Read More");
  });
});
`,
  "resizable-panels": `import { describe, it, expect, afterEach } from "vitest";
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
`,
  "inactivity-warning": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("inactivity-warning", () => {
  let user;
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows inactivity modal after 60s idle and resets on stay active", async () => {
    render(<App />);
    expect(screen.queryByTestId("inactivity-modal")).not.toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(60000);
    await waitFor(() => expect(screen.getByTestId("inactivity-modal")).toBeInTheDocument());
    await user.click(screen.getByTestId("stay-active-btn"));
    expect(screen.queryByTestId("inactivity-modal")).not.toBeInTheDocument();
  });
});
`,
  "countdown-timer": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("countdown-timer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders days/hours/minutes/seconds remaining", () => {
    render(<App />);
    const display = screen.getByTestId("countdown-display");
    expect(display).toHaveTextContent(/Days/);
    expect(display).toHaveTextContent(/Hours/);
    expect(display).toHaveTextContent(/Minutes/);
    expect(display).toHaveTextContent(/Seconds/);
  });

  it("shows launched message when target is reached", async () => {
    render(<App />);
    expect(screen.getByTestId("countdown-display")).toBeInTheDocument();
    // Jump the clock past the module-scoped TARGET without ticking a full day of intervals.
    vi.setSystemTime(Date.now() + 1000 * 60 * 60 * 24 + 20000);
    await vi.advanceTimersByTimeAsync(300);
    expect(screen.getByTestId("event-launched-msg")).toHaveTextContent(/launched/i);
  });
});
`,
  "credit-card-visual": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("credit-card-visual", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("mirrors card number and expiry on the visual card", async () => {
    render(<App />);
    await user.type(screen.getByLabelText(/Card Number/i), "4111111111111111");
    await user.type(screen.getByLabelText(/Expiry/i), "12/30");
    const card = screen.getByTestId("visual-card");
    expect(card).toHaveTextContent("4111");
    expect(card).toHaveTextContent("12/30");
  });

  it("flips to show CVV when focusing CVV field", async () => {
    render(<App />);
    await user.click(screen.getByLabelText(/CVV/i));
    await user.type(screen.getByLabelText(/CVV/i), "123");
    expect(screen.getByTestId("visual-card")).toHaveTextContent("123");
  });
});
`,
  "cart-drawer": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("cart-drawer", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("opens and closes the cart drawer", async () => {
    render(<App />);
    expect(screen.queryByTestId("cart-drawer")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("open-cart-btn"));
    expect(screen.getByTestId("cart-drawer")).toBeInTheDocument();
    await user.click(screen.getByTestId("close-cart-btn"));
    expect(screen.queryByTestId("cart-drawer")).not.toBeInTheDocument();
  });
});
`,
  "cookie-consent": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("cookie-consent", () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows banner and stores acceptance in localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByTestId("cookie-banner")).toBeInTheDocument();
    await user.click(screen.getByTestId("accept-cookies-btn"));
    expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument();
    expect(localStorage.getItem("cookies_accepted")).toBe("true");
  });

  it("hides banner when already accepted", async () => {
    localStorage.setItem("cookies_accepted", "true");
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument();
    });
  });
});
`,
  "fab-menu": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("fab-menu", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("expands and collapses child actions from the main FAB", async () => {
    render(<App />);
    expect(screen.queryByTestId("fab-child-1")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("fab-main"));
    expect(screen.getByTestId("fab-child-1")).toBeInTheDocument();
    expect(screen.getByTestId("fab-child-2")).toBeInTheDocument();
    expect(screen.getByTestId("fab-child-3")).toBeInTheDocument();
    await user.click(screen.getByTestId("fab-main"));
    expect(screen.queryByTestId("fab-child-1")).not.toBeInTheDocument();
  });
});
`,
  "mentions-input": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("mentions-input", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("shows mention dropdown after typing @ and inserts selection", async () => {
    render(<App />);
    const input = screen.getByTestId("mention-input");
    await user.type(input, "Hi @al");
    const dropdown = screen.getByTestId("mention-dropdown");
    expect(within(dropdown).getByText("@alice")).toBeInTheDocument();
    await user.click(within(dropdown).getByText("@alice"));
    expect(input.value).toMatch(/@alice/);
    expect(screen.queryByTestId("mention-dropdown")).not.toBeInTheDocument();
  });
});
`,
  "dynamic-form-builder": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("dynamic-form-builder", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("adds, edits, and removes custom fields", async () => {
    render(<App />);
    expect(screen.getByTestId("custom-field-0")).toBeInTheDocument();
    await user.click(screen.getByTestId("add-field-btn"));
    expect(screen.getByTestId("custom-field-1")).toBeInTheDocument();
    const row = screen.getByTestId("custom-field-1");
    await user.type(within(row).getByPlaceholderText("Label"), "Age");
    await user.selectOptions(within(row).getByRole("combobox"), "Number");
    expect(within(row).getByPlaceholderText("Label")).toHaveValue("Age");
    expect(within(row).getByRole("combobox")).toHaveValue("Number");
    await user.click(within(row).getByRole("button", { name: /remove/i }));
    expect(screen.queryByTestId("custom-field-1")).not.toBeInTheDocument();
  });
});
`,
  "image-zoomer": `import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("image-zoomer", () => {
  afterEach(() => cleanup());
  it("shows zoom preview under the cursor and hides on leave", () => {
    render(<App />);
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
`,
  "file-tree-view": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("file-tree-view", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders folders/files and toggles folder children", async () => {
    render(<App />);
    expect(screen.getByTestId("folder-src")).toBeInTheDocument();
    expect(screen.getByTestId("file-app")).toBeInTheDocument();
    expect(screen.getByTestId("file-readme")).toBeInTheDocument();
    await user.click(screen.getByTestId("folder-src"));
    expect(screen.queryByTestId("file-app")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("folder-src"));
    expect(screen.getByTestId("file-app")).toBeInTheDocument();
  });
});
`,
  "network-status-banner": `import { describe, it, expect, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("network-status-banner", () => {
  afterEach(() => cleanup());
  it("reacts to offline and online window events", () => {
    render(<App />);
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
`,
  "print-receipt": `import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("print-receipt", () => {
  let printSpy;
  beforeEach(() => {
    printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    printSpy.mockRestore();
  });

  it("renders invoice and triggers window.print", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByTestId("invoice-view")).toHaveTextContent("Invoice");
    await user.click(screen.getByTestId("print-btn"));
    expect(printSpy).toHaveBeenCalled();
  });
});
`,
  "stepper-indicator": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("stepper-indicator", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("exposes completed, active, and pending step states", async () => {
    render(<App />);
    expect(screen.getByTestId("stepper")).toBeInTheDocument();
    expect(screen.getByTestId("step-node-1")).toHaveAttribute("data-state", "completed");
    expect(screen.getByTestId("step-node-2")).toHaveAttribute("data-state", "active");
    expect(screen.getByTestId("step-node-3")).toHaveAttribute("data-state", "pending");
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByTestId("step-node-3")).toHaveAttribute("data-state", "active");
    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByTestId("step-node-2")).toHaveAttribute("data-state", "active");
  });
});
`,
  "pricing-calculator": `import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("pricing-calculator", () => {
  afterEach(() => cleanup());
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("calculates monthly and yearly prices from the slider", async () => {
    render(<App />);
    const slider = screen.getByTestId("user-slider");
    fireEvent.change(slider, { target: { value: "10" } });
    expect(screen.getByTestId("calculated-price")).toHaveTextContent("$100");
    await user.click(screen.getByTestId("billing-toggle"));
    expect(screen.getByTestId("billing-toggle")).toBeChecked();
    expect(screen.getByTestId("calculated-price")).toHaveTextContent("$960");
  });
});
`,
};
