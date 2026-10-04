/**
 * Vitest + RTL oracle tests for React core cases.
 * Each value is the full body of `__bench__/ui.oracle.test.jsx`.
 */
export const coreOracles = {
  "counter-state": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("counter-state", () => {
  it("starts at 0", () => {
    render(<App />);
    expect(screen.getByTestId("counter-container")).toBeInTheDocument();
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });

  it("increments the count", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("increment-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("2");
  });

  it("decrements but not below 0", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("decrement-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
    await user.click(screen.getByTestId("decrement-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });

  it("resets to 0", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("increment-btn"));
    await user.click(screen.getByTestId("reset-btn"));
    expect(screen.getByTestId("count-display")).toHaveTextContent("0");
  });
});
`,

  "login-form": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("login-form", () => {
  it("shows error when fields are empty", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-status")).toHaveTextContent(
      "Please fill all fields"
    );
  });

  it("shows error when only email is filled", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("email-input"), "a@b.com");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-status")).toHaveTextContent(
      "Please fill all fields"
    );
  });

  it("shows welcome message on valid submit", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("email-input"), "ada@example.com");
    await user.type(screen.getByTestId("password-input"), "secret");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-status")).toHaveTextContent(
      "Welcome, ada@example.com"
    );
  });

  it("keeps form elements mounted", () => {
    render(<App />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });
});
`,

  "status-badge": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("status-badge", () => {
  it("starts Online with green background", () => {
    render(<App />);
    expect(screen.getByTestId("status-container")).toBeInTheDocument();
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Online");
    expect(badge).toHaveStyle({ background: "green" });
  });

  it("toggles to Offline with gray background", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("status-toggle-btn"));
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Offline");
    expect(badge).toHaveStyle({ background: "gray" });
  });

  it("toggles back to Online", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("status-toggle-btn"));
    await user.click(screen.getByTestId("status-toggle-btn"));
    expect(screen.getByTestId("status-badge")).toHaveTextContent("Online");
  });
});
`,

  "dynamic-item-list": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("dynamic-item-list", () => {
  it("starts with an empty list", () => {
    render(<App />);
    expect(screen.getByTestId("item-list")).toBeInTheDocument();
    expect(screen.queryByTestId("item-row-0")).not.toBeInTheDocument();
  });

  it("adds a non-empty item", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("item-input"), "Apples");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("item-row-0")).toHaveTextContent("Apples");
  });

  it("rejects empty and whitespace-only items", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("item-row-0")).not.toBeInTheDocument();
    await user.type(screen.getByTestId("item-input"), "   ");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("item-row-0")).not.toBeInTheDocument();
  });

  it("appends multiple items with sequential test ids", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("item-input"), "One");
    await user.click(screen.getByTestId("add-btn"));
    await user.type(screen.getByTestId("item-input"), "Two");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("item-row-0")).toHaveTextContent("One");
    expect(screen.getByTestId("item-row-1")).toHaveTextContent("Two");
  });
});
`,

  "user-profile-card": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("user-profile-card", () => {
  it("renders user card with name, role, and avatar", () => {
    userEvent.setup();
    render(<App />);
    expect(screen.getByTestId("user-card")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toHaveTextContent("Ada Lovelace");
    expect(screen.getByTestId("user-role")).toHaveTextContent("Engineer");
    expect(screen.getByTestId("user-avatar")).toHaveAttribute(
      "src",
      "https://example.com/ada.png"
    );
  });
});
`,

  "modal-children": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("modal-children", () => {
  it("renders title and children in the modal", () => {
    render(<App />);
    expect(screen.getByTestId("modal-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Hello");
    expect(screen.getByTestId("modal-body")).toHaveTextContent(
      "Modal body content"
    );
  });

  it("closes when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("modal-close-btn"));
    expect(screen.queryByTestId("modal-wrapper")).not.toBeInTheDocument();
  });

  it("can reopen after closing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("modal-close-btn"));
    await user.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByTestId("modal-wrapper")).toBeInTheDocument();
  });
});
`,

  "document-title-sync": `import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("document-title-sync", () => {
  afterEach(() => {
    document.title = "";
  });

  it("updates document.title as the user types", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("title-input");
    await user.clear(input);
    await user.type(input, "Bench Title");
    expect(document.title).toBe("Bench Title");
  });

  it("reflects each keystroke in document.title", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByTestId("title-input"), "Hi");
    expect(document.title).toBe("Hi");
  });
});
`,

  "fetch-users-loading": `import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("fetch-users-loading", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows loading then the user list on success", async () => {
    render(<App />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    expect(screen.getByTestId("user-list")).toHaveTextContent("Alice");
    expect(screen.getByTestId("user-list")).toHaveTextContent("Bob");
  });

  it("shows error banner when request fails", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("checkbox", { name: /fail request/i }));
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("user-list")).not.toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Failed to fetch users"
    );
  });

  it("resolves with fake timers", async () => {
    vi.useFakeTimers();
    render(<App />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(60);
    expect(screen.getByTestId("user-list")).toBeInTheDocument();
  });
});
`,

  "use-local-storage": `import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("use-local-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists typed value to localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("persistent-input");
    await user.type(input, "remember-me");
    await waitFor(() => {
      expect(localStorage.getItem("persistent-input")).toBe("remember-me");
    });
    expect(input).toHaveValue("remember-me");
  });

  it("restores value from localStorage on remount", async () => {
    localStorage.setItem("persistent-input", "cached");
    const { unmount } = render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("persistent-input")).toHaveValue("cached");
    });
    unmount();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("persistent-input")).toHaveValue("cached");
    });
  });
});
`,

  "autofocus-search": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("autofocus-search", () => {
  it("focuses the search input when focus button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("search-input");
    expect(input).not.toHaveFocus();
    await user.click(screen.getByTestId("focus-btn"));
    expect(input).toHaveFocus();
  });
});
`,

  "stopwatch-ref": `import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("stopwatch-ref", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0 seconds", () => {
    render(<App />);
    expect(screen.getByTestId("timer-display")).toHaveTextContent("0");
  });

  it("increments while running and stops when stopped", () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByTestId("start-btn"));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("timer-display")).toHaveTextContent("3");
    fireEvent.click(screen.getByTestId("stop-btn"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("timer-display")).toHaveTextContent("3");
  });
});
`,

  "memo-prime-calculator": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("memo-prime-calculator", () => {
  it("reports prime for a prime number", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("number-input");
    await user.clear(input);
    await user.type(input, "7");
    expect(screen.getByTestId("prime-result")).toHaveTextContent("prime");
  });

  it("reports not prime for a composite number", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("number-input");
    await user.clear(input);
    await user.type(input, "8");
    expect(screen.getByTestId("prime-result")).toHaveTextContent("not prime");
  });

  it("reports not prime for numbers below 2", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("number-input");
    await user.clear(input);
    await user.type(input, "1");
    expect(screen.getByTestId("prime-result")).toHaveTextContent("not prime");
  });
});
`,

  "callback-memo-child": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("callback-memo-child", () => {
  it("renders parent count and child button", () => {
    render(<App />);
    expect(screen.getByTestId("parent-count")).toHaveTextContent("0");
    expect(screen.getByTestId("child-action-btn")).toBeInTheDocument();
  });

  it("updates parent count independently of child clicks", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /inc parent/i }));
    expect(screen.getByTestId("parent-count")).toHaveTextContent("1");
    expect(screen.getByTestId("child-action-btn")).toBeInTheDocument();
  });

  it("invokes the memoized child callback", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("child-action-btn"));
    await user.click(screen.getByTestId("child-action-btn"));
    expect(screen.getByText(/child clicks:\\s*2/i)).toBeInTheDocument();
  });
});
`,

  "theme-context": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("theme-context", () => {
  it("starts in light theme", () => {
    render(<App />);
    const panel = screen.getByTestId("content-panel");
    expect(panel).toHaveTextContent(/light/i);
    expect(panel).toHaveStyle({ background: "#f5f5f5" });
  });

  it("toggles to dark theme", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("theme-toggle"));
    const panel = screen.getByTestId("content-panel");
    expect(panel).toHaveTextContent(/dark/i);
    expect(panel).toHaveStyle({ background: "#222" });
  });

  it("toggles back to light", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("theme-toggle"));
    await user.click(screen.getByTestId("theme-toggle"));
    expect(screen.getByTestId("content-panel")).toHaveTextContent(/light/i);
  });
});
`,

  "auth-context": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("auth-context", () => {
  it("shows Guest when logged out", () => {
    render(<App />);
    expect(screen.getByTestId("user-greeting")).toHaveTextContent("Guest");
  });

  it("logs in and shows username greeting", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("login-btn"));
    expect(screen.getByTestId("user-greeting")).toHaveTextContent(
      "Logged in as demo"
    );
  });

  it("logs out back to Guest", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("login-btn"));
    await user.click(screen.getByTestId("logout-btn"));
    expect(screen.getByTestId("user-greeting")).toHaveTextContent("Guest");
  });
});
`,

  "wizard-reducer": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("wizard-reducer", () => {
  it("starts at step 1 of 4", () => {
    render(<App />);
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
  });

  it("advances with next and retreats with prev", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 2 of 4"
    );
    await user.click(screen.getByTestId("prev-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
  });

  it("clamps at the first and last steps", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("prev-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 4 of 4"
    );
    await user.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 4 of 4"
    );
  });

  it("resets to step 1", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByTestId("next-btn"));
    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.getByTestId("step-display")).toHaveTextContent(
      "Step 1 of 4"
    );
  });
});
`,

  "error-boundary": `import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("error-boundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows crash button initially", () => {
    render(<App />);
    expect(screen.getByTestId("crash-btn")).toBeInTheDocument();
    expect(screen.queryByTestId("error-fallback")).not.toBeInTheDocument();
  });

  it("renders fallback after crash button is clicked", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("crash-btn"));
    expect(screen.getByTestId("error-fallback")).toHaveTextContent(
      "Something went wrong"
    );
    expect(screen.queryByTestId("crash-btn")).not.toBeInTheDocument();
  });
});
`,

  "portal-tooltip": `import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("portal-tooltip", () => {
  beforeEach(() => {
    const root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.getElementById("modal-root")?.remove();
  });

  it("renders tooltip into #modal-root on hover", async () => {
    render(<App />);
    // Wait for useEffect to capture modal-root
    await waitFor(() => {
      fireEvent.mouseEnter(screen.getByTestId("tooltip-target"));
      expect(screen.getByTestId("portal-tooltip")).toBeInTheDocument();
    });
    const modalRoot = document.getElementById("modal-root");
    expect(modalRoot.contains(screen.getByTestId("portal-tooltip"))).toBe(true);
  });

  it("hides tooltip on mouse leave", async () => {
    render(<App />);
    const target = screen.getByTestId("tooltip-target");
    await waitFor(() => {
      fireEvent.mouseEnter(target);
      expect(screen.getByTestId("portal-tooltip")).toBeInTheDocument();
    });
    fireEvent.mouseLeave(target);
    expect(screen.queryByTestId("portal-tooltip")).not.toBeInTheDocument();
  });
});
`,

  "uncontrolled-file-upload": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("uncontrolled-file-upload", () => {
  it("displays selected file name after submit", async () => {
    const user = userEvent.setup();
    render(<App />);
    const file = new File(["hello"], "report.pdf", {
      type: "application/pdf",
    });
    await user.upload(screen.getByTestId("file-input"), file);
    await user.click(screen.getByTestId("upload-btn"));
    expect(screen.getByTestId("file-name-display")).toHaveTextContent(
      "report.pdf"
    );
  });

  it("keeps display empty when submitting without a file", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId("upload-btn"));
    expect(screen.getByTestId("file-name-display")).toHaveTextContent("");
  });
});
`,

  "forward-ref-input": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("forward-ref-input", () => {
  it("focuses FancyInput when parent button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId("fancy-input");
    expect(input).not.toHaveFocus();
    await user.click(screen.getByTestId("parent-focus-btn"));
    expect(input).toHaveFocus();
  });
});
`,

  "status-icon-switch": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("status-icon-switch", () => {
  it("renders success icon by default", () => {
    render(<App />);
    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("success")).toBeInTheDocument();
  });

  it("switches icon when type changes", async () => {
    const user = userEvent.setup();
    render(<App />);
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "warning");
    expect(screen.getByLabelText("warning")).toBeInTheDocument();
    await user.selectOptions(select, "error");
    expect(screen.getByLabelText("error")).toBeInTheDocument();
    await user.selectOptions(select, "success");
    expect(screen.getByLabelText("success")).toBeInTheDocument();
  });
});
`,

  "click-outside-dropdown": `import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("click-outside-dropdown", () => {
  it("renders the dropdown open initially", () => {
    render(<App />);
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("closes when clicking outside via document fireEvent", () => {
    render(<App />);
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("stays open when clicking inside the menu", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("dropdown-menu"));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("can reopen after outside click", async () => {
    const user = userEvent.setup();
    render(<App />);
    fireEvent.click(document.body);
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });
});
`,

  "lazy-suspense-tabs": `import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("lazy-suspense-tabs", () => {
  it("loads overview panel after suspense", async () => {
    render(<App />);
    const fallback = screen.queryByTestId("suspense-fallback");
    if (fallback) {
      expect(fallback).toHaveTextContent("Loading module...");
    }
    await waitFor(() => {
      expect(screen.getByTestId("overview-panel")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("suspense-fallback")).not.toBeInTheDocument();
  });

  it("switches to analytics tab with waitFor", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("overview-panel")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /^analytics$/i }));
    await waitFor(() => {
      expect(screen.getByTestId("analytics-panel")).toBeInTheDocument();
    });
  });
});
`,

  "use-debounce-search": `import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../src/App.jsx";

describe("use-debounce-search", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates debounced value 500ms after typing stops", () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.change(screen.getByTestId("debounced-input"), {
      target: { value: "query" },
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("");
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("query");
  });

  it("resets the debounce window on continued typing", () => {
    vi.useFakeTimers();
    render(<App />);
    const input = screen.getByTestId("debounced-input");
    fireEvent.change(input, { target: { value: "ab" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.change(input, { target: { value: "abc" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByTestId("debounced-value")).toHaveTextContent("abc");
  });
});
`,

  "with-authorization-hoc": `import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";

describe("with-authorization-hoc", () => {
  it("shows dashboard for admin role", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-view")).toHaveTextContent(
      "Admin Dashboard"
    );
    expect(screen.queryByTestId("unauthorized-msg")).not.toBeInTheDocument();
  });

  it("shows unauthorized message for non-admin role", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByRole("combobox"), "user");
    expect(screen.getByTestId("unauthorized-msg")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-view")).not.toBeInTheDocument();
  });

  it("restores dashboard when switching back to admin", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByRole("combobox"), "user");
    await user.selectOptions(screen.getByRole("combobox"), "admin");
    expect(screen.getByTestId("dashboard-view")).toBeInTheDocument();
  });
});
`,
};
