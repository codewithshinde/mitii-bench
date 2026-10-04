/**
 * React ecosystem library cases (prompts 26–55 from references/react-tasks.md).
 * Skips 31 (React Native Paper — not applicable to web fixtures).
 * Routing: 4 react-router cases + 4 Next App Router native variants.
 * No reactSolution — scaffolded for agent eval without dry-run solutions initially.
 */

export const libraryCases = [
  // ─── UI Libraries ───────────────────────────────────────────────────────────

  {
    slug: "mui-data-grid",
    title: "Material UI (MUI): Data Grid & Pagination",
    difficulty: "medium",
    tags: ["ecosystem-lib", "mui", "data-grid"],
    packages: ["mui"],
    bases: ["base-react-js"],
    prompt: `Build an MUI DataGrid component displaying user records.

* **Table** (\`data-testid="mui-data-grid"\`).
* **Columns**: ID, Name, Email.
* **Search Box** (\`data-testid="grid-search"\`): Filters rows by name.

Use \`@mui/x-data-grid\` (and MUI core as needed). Seed the grid with a small set of user rows so search filtering is demonstrable.`,
    testids: ["mui-data-grid", "grid-search"],
    markers: ["@mui/x-data-grid", "DataGrid"],
  },

  {
    slug: "mui-snackbar",
    title: "Material UI (MUI): Snackbar Alerts",
    difficulty: "easy",
    tags: ["ecosystem-lib", "mui", "feedback"],
    packages: ["mui"],
    bases: ["base-react-js"],
    prompt: `Build a feedback notification trigger using MUI Snackbar and Alert.

* **Trigger Button** (\`data-testid="show-alert-btn"\`).
* **MUI Snackbar** (\`data-testid="mui-snackbar"\`): Opens with message "Action Successful" and auto-hides after 3 seconds.

Use \`@mui/material\` Snackbar and Alert components.`,
    testids: ["show-alert-btn", "mui-snackbar"],
    markers: ["@mui/material", "Snackbar", "Alert"],
  },

  {
    slug: "chakra-color-mode",
    title: "Chakra UI: Color Mode Switcher & Responsive Box",
    difficulty: "easy",
    tags: ["ecosystem-lib", "chakra", "theme"],
    packages: ["chakra"],
    bases: ["base-react-js"],
    prompt: `Build a responsive card using Chakra UI.

* **Card Box** (\`data-testid="chakra-card"\`): Responsive width (\`100%\` on mobile, \`50%\` on desktop).
* **Dark Mode Toggle** (\`data-testid="chakra-theme-btn"\`): Switches theme via \`useColorMode\`.

Wrap the app with Chakra's color-mode provider so the toggle works.`,
    testids: ["chakra-card", "chakra-theme-btn"],
    markers: ["@chakra-ui/react", "useColorMode"],
  },

  {
    slug: "antd-form-validation",
    title: "Ant Design (antd): Form Validation",
    difficulty: "medium",
    tags: ["ecosystem-lib", "antd", "forms"],
    packages: ["antd"],
    bases: ["base-react-js"],
    prompt: `Build an Ant Design \`<Form>\` with built-in validation rules.

* **Form** (\`data-testid="antd-form"\`).
* **Inputs**: Username (required), Age (number between 18-99).
* **Submit Button** (\`data-testid="antd-submit"\`).

Use antd Form rules so invalid submit surfaces field errors without a custom validator library.`,
    testids: ["antd-form", "antd-submit"],
    markers: ["antd", "Form", "rules"],
  },

  {
    slug: "shadcn-radix-dialog",
    title: "Shadcn UI / Radix Primitives: Dialog",
    difficulty: "medium",
    tags: ["ecosystem-lib", "radix", "shadcn", "dialog", "a11y"],
    packages: ["radix"],
    bases: ["base-react-js"],
    prompt: `Build an accessible modal using Radix UI / Shadcn Dialog.

* **Trigger** (\`data-testid="dialog-trigger"\`).
* **Content** (\`data-testid="dialog-content"\`).
* **Close Button** (\`data-testid="dialog-close"\`): Focus returns to trigger when dialog closes.

Use \`@radix-ui/react-dialog\` (or an equivalent Shadcn Dialog built on Radix).`,
    testids: ["dialog-trigger", "dialog-content", "dialog-close"],
    markers: ["@radix-ui/react-dialog", "Dialog"],
  },

  {
    slug: "headlessui-menu",
    title: "Tailwind / Headless UI: Accessible Menu Dropdown",
    difficulty: "easy",
    tags: ["ecosystem-lib", "headlessui", "menu", "a11y"],
    packages: ["headlessui"],
    bases: ["base-react-js"],
    prompt: `Build an accessible dropdown menu using \`@headlessui/react\`.

* **Menu Button** (\`data-testid="headless-menu-btn"\`).
* **Menu Items** (\`data-testid="headless-menu-items"\`): Navigable via Keyboard Arrow keys.

Use Headless UI \`Menu\` / \`MenuButton\` / \`MenuItems\` / \`MenuItem\` primitives.`,
    testids: ["headless-menu-btn", "headless-menu-items"],
    markers: ["@headlessui/react", "Menu"],
  },

  // ─── Routing — React Router ─────────────────────────────────────────────────

  {
    slug: "react-router-basic-nav",
    title: "React Router v6: Basic Navigation",
    difficulty: "easy",
    tags: ["ecosystem-lib", "react-router", "routing"],
    packages: ["react-router"],
    bases: ["base-react-js"],
    prompt: `Build a navigation bar with \`Link\` and \`Routes\` using React Router v6.

* **Nav Links**: Home (\`data-testid="link-home"\`), Dashboard (\`data-testid="link-dashboard"\`).
* **Route Views**: Displays "Home View" (\`data-testid="view-home"\`) or "Dashboard View" (\`data-testid="view-dashboard"\`).

Wire \`BrowserRouter\` (or equivalent) so client-side navigation updates the visible view without a full reload.`,
    testids: ["link-home", "link-dashboard", "view-home", "view-dashboard"],
    markers: ["react-router-dom", "Link", "Routes", "Route"],
  },

  {
    slug: "react-router-params",
    title: "React Router v6: Dynamic URL Parameters",
    difficulty: "medium",
    tags: ["ecosystem-lib", "react-router", "routing", "params"],
    packages: ["react-router"],
    bases: ["base-react-js"],
    prompt: `Build a product detail page router using React Router \`useParams\`.

* **URL**: \`/products/:id\`
* **Component**: Reads \`:id\` from URL and renders "Product Details for ID: [id]" (\`data-testid="product-detail"\`).

Include a way to navigate to at least one sample product URL so the param is visible.`,
    testids: ["product-detail"],
    markers: ["react-router-dom", "useParams"],
  },

  {
    slug: "react-router-protected",
    title: "React Router v6: Protected Routes",
    difficulty: "hard",
    tags: ["ecosystem-lib", "react-router", "routing", "auth"],
    packages: ["react-router"],
    bases: ["base-react-js"],
    prompt: `Build a route guard wrapper component \`RequireAuth\` using React Router v6.

* **Behavior**: Redirects unauthenticated users to \`/login\`. Renders \`<Outlet/>\` if \`isAuthenticated === true\`.
* **Login View** (\`data-testid="login-view"\`): Shown at \`/login\` when unauthenticated.
* **Protected Content** (\`data-testid="protected-view"\`): Rendered via outlet when authenticated.

Provide a minimal auth toggle (or login control) so both the redirect and authenticated outlet paths can be exercised.`,
    testids: ["login-view", "protected-view"],
    markers: ["react-router-dom", "Outlet", "Navigate", "RequireAuth"],
  },

  {
    slug: "react-router-search-params",
    title: "React Router v6: Query String Parameters",
    difficulty: "medium",
    tags: ["ecosystem-lib", "react-router", "routing", "search-params"],
    packages: ["react-router"],
    bases: ["base-react-js"],
    prompt: `Build a search result page using React Router \`useSearchParams\`.

* **Input** (\`data-testid="query-input"\`).
* **Behavior**: Typing updates the URL search query (\`?q=term\`). Read query from URL and display "Results for: [term]" (\`data-testid="search-results"\`).`,
    testids: ["query-input", "search-results"],
    markers: ["react-router-dom", "useSearchParams"],
  },

  // ─── Routing — Next.js App Router (native, no react-router) ─────────────────

  {
    slug: "next-basic-nav",
    title: "Next.js App Router: Basic Navigation",
    difficulty: "easy",
    tags: ["vanilla", "next-router", "smoke", "routing"],
    packages: [],
    bases: ["base-next-js"],
    prompt: `Build a navigation bar using Next.js App Router \`Link\` and route segments (no react-router).

* **Nav Links**: Home (\`data-testid="link-home"\`), Dashboard (\`data-testid="link-dashboard"\`).
* **Route Views**: Displays "Home View" (\`data-testid="view-home"\`) or "Dashboard View" (\`data-testid="view-dashboard"\`).

Use the App Router file-based routes (e.g. \`app/page.tsx\` and \`app/dashboard/page.tsx\`) with \`next/link\`.`,
    testids: ["link-home", "link-dashboard", "view-home", "view-dashboard"],
    markers: ["next/link", "Link"],
    gradeAsserts: [
      { contains: { file: "components/Nav.js", text: 'data-testid="link-home"' } },
      { contains: { file: "components/Nav.js", text: 'data-testid="link-dashboard"' } },
      { contains: { file: "app/page.js", text: 'data-testid="view-home"' } },
      { contains: { file: "app/dashboard/page.js", text: 'data-testid="view-dashboard"' } },
      { contains: { file: "components/Nav.js", text: "next/link" } },
      { contains: { file: "components/Nav.js", text: "Link" } },
      { exists: { file: "app/dashboard/page.js" } },
    ],
    solutionFiles: {
      "components/Nav.js": `import Link from "next/link";

export default function Nav() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link href="/" data-testid="link-home">
        Home
      </Link>
      <Link href="/dashboard" data-testid="link-dashboard">
        Dashboard
      </Link>
    </nav>
  );
}
`,
      "app/page.js": `import Nav from "../components/Nav";

export default function HomePage() {
  return (
    <div>
      <Nav />
      <main data-testid="view-home">Home View</main>
    </div>
  );
}
`,
      "app/dashboard/page.js": `import Nav from "../../components/Nav";

export default function DashboardPage() {
  return (
    <div>
      <Nav />
      <main data-testid="view-dashboard">Dashboard View</main>
    </div>
  );
}
`,
    },
  },

  {
    slug: "next-dynamic-params",
    title: "Next.js App Router: Dynamic URL Parameters",
    difficulty: "medium",
    tags: ["next-router", "routing", "params"],
    packages: [],
    bases: ["base-next-js"],
    prompt: `Build a product detail page using Next.js App Router dynamic segments and \`useParams\`.

* **URL**: \`/products/[id]\` (App Router dynamic route)
* **Component**: Reads \`id\` from the URL and renders "Product Details for ID: [id]" (\`data-testid="product-detail"\`).

Use \`app/products/[id]/page.tsx\` (or equivalent) and \`next/navigation\` \`useParams\` (client) or the page \`params\` prop.`,
    testids: ["product-detail"],
    markers: ["useParams", "next/navigation", "[id]"],
    gradeAsserts: [
      { contains: { file: "app/products/[id]/page.js", text: 'data-testid="product-detail"' } },
      { contains: { file: "app/products/[id]/page.js", text: "useParams" } },
      { contains: { file: "app/products/[id]/page.js", text: "next/navigation" } },
      { contains: { file: "app/products/[id]/page.js", text: "[id]" } },
      { exists: { file: "app/products/[id]/page.js" } },
    ],
    solutionFiles: {
      "app/page.js": `import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Products</h1>
      <Link href="/products/42">View product 42</Link>
    </div>
  );
}
`,
      "app/products/[id]/page.js": `"use client";

import { useParams } from "next/navigation";

// App Router dynamic segment: /products/[id]
export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div data-testid="product-detail">Product Details for ID: {id}</div>
  );
}
`,
    },
  },

  {
    slug: "next-protected-route",
    title: "Next.js App Router: Protected Routes",
    difficulty: "hard",
    tags: ["next-router", "routing", "auth"],
    packages: [],
    bases: ["base-next-js"],
    prompt: `Build a route guard for Next.js App Router that protects authenticated pages (no react-router).

* **Behavior**: Redirects unauthenticated users to \`/login\`. Allows access to the protected view when \`isAuthenticated === true\`.
* **Login View** (\`data-testid="login-view"\`): Shown at \`/login\` when unauthenticated.
* **Protected Content** (\`data-testid="protected-view"\`): Rendered when authenticated.

Prefer a middleware redirect pattern and/or a server/client check with \`redirect\` from \`next/navigation\`. Provide a minimal auth toggle (or login page) so both paths can be exercised.`,
    testids: ["login-view", "protected-view"],
    markers: ["middleware", "redirect", "next/navigation"],
    gradeAsserts: [
      { contains: { file: "app/login/page.js", text: 'data-testid="login-view"' } },
      { contains: { file: "app/page.js", text: 'data-testid="protected-view"' } },
      { contains: { file: "middleware.js", text: "middleware" } },
      { contains: { file: "middleware.js", text: "redirect" } },
      { contains: { file: "app/page.js", text: "next/navigation" } },
      { exists: { file: "middleware.js" } },
    ],
    solutionFiles: {
      "middleware.js": `import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("auth")?.value === "1";
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
`,
      "app/page.js": `import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const isAuthenticated = cookies().get("auth")?.value === "1";
  if (!isAuthenticated) {
    redirect("/login");
  }

  return <div data-testid="protected-view">Protected Content</div>;
}
`,
      "app/login/page.js": `"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function handleLogin() {
    document.cookie = "auth=1; path=/";
    router.push("/");
    router.refresh();
  }

  return (
    <div data-testid="login-view">
      <h1>Login</h1>
      <button type="button" onClick={handleLogin}>
        Sign in
      </button>
    </div>
  );
}
`,
    },
  },

  {
    slug: "next-search-params",
    title: "Next.js App Router: Search Query Parameters",
    difficulty: "medium",
    tags: ["next-router", "routing", "search-params"],
    packages: [],
    bases: ["base-next-js"],
    prompt: `Build a search result page using Next.js App Router \`useSearchParams\`.

* **Input** (\`data-testid="query-input"\`).
* **Behavior**: Typing updates the URL search query (\`?q=term\`). Read query from URL and display "Results for: [term]" (\`data-testid="search-results"\`).

Use \`next/navigation\` \`useSearchParams\` (and \`useRouter\` / \`usePathname\` as needed) in a client component. Wrap with a Suspense boundary if required by Next.`,
    testids: ["query-input", "search-results"],
    markers: ["useSearchParams", "next/navigation"],
    solutionFiles: {
      "app/page.js": `"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = searchParams.get("q") || "";

  function onQueryChange(event) {
    const params = new URLSearchParams(searchParams.toString());
    const value = event.target.value;
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    const query = params.toString();
    router.replace(query ? \`\${pathname}?\${query}\` : pathname);
  }

  return (
    <div>
      <input
        data-testid="query-input"
        value={q}
        onChange={onQueryChange}
        placeholder="Search..."
      />
      <div data-testid="search-results">Results for: {q}</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
`,
    },
  },

  {
    slug: "redux-cart-slice",
    title: "Redux Toolkit: Slice & Store Integration",
    difficulty: "medium",
    tags: ["ecosystem-lib", "redux", "state"],
    packages: ["redux"],
    bases: ["base-react-js"],
    prompt: `Build a Redux slice \`cartSlice\` with actions \`addItem\`, \`removeItem\`.

* **Cart Count** (\`data-testid="cart-count"\`): Selects total items from Redux store.
* **Add Button** (\`data-testid="add-to-cart-btn"\`): Dispatches \`addItem\`.

Use Redux Toolkit (\`createSlice\`, \`configureStore\`) and \`react-redux\` Provider / hooks.`,
    testids: ["cart-count", "add-to-cart-btn"],
    markers: ["@reduxjs/toolkit", "createSlice", "react-redux"],
  },

  {
    slug: "redux-async-thunk",
    title: "Redux Toolkit: Async Thunk Data Fetching",
    difficulty: "hard",
    tags: ["ecosystem-lib", "redux", "async", "state"],
    packages: ["redux"],
    bases: ["base-react-js"],
    prompt: `Build a product list fetching via \`createAsyncThunk\`.

* **Status Display** (\`data-testid="thunk-status"\`): Displays \`idle\`, \`loading\`, \`succeeded\`, or \`failed\`.
* **List** (\`data-testid="thunk-data-list"\`).

Dispatch the thunk on mount (or via a load button) and wire pending/fulfilled/rejected into the slice status.`,
    testids: ["thunk-status", "thunk-data-list"],
    markers: ["@reduxjs/toolkit", "createAsyncThunk"],
  },

  {
    slug: "zustand-toast-store",
    title: "Zustand: Global Store",
    difficulty: "easy",
    tags: ["ecosystem-lib", "zustand", "state"],
    packages: ["zustand"],
    bases: ["base-react-js"],
    prompt: `Build a simple global notification store using Zustand.

* **Trigger Button** (\`data-testid="trigger-toast"\`): Calls store action \`addNotification('Hello')\`.
* **Toast List** (\`data-testid="toast-list"\`): Renders active notifications from store state.

Use the \`zustand\` \`create\` API for the store.`,
    testids: ["trigger-toast", "toast-list"],
    markers: ["zustand", "create", "addNotification"],
  },

  {
    slug: "jotai-shared-atom",
    title: "Jotai: Atomic State",
    difficulty: "easy",
    tags: ["ecosystem-lib", "jotai", "state"],
    packages: ["jotai"],
    bases: ["base-react-js"],
    prompt: `Build an application with two independent components sharing an atomic state (\`countAtom\`).

* **Component A** (\`data-testid="atom-inc-btn"\`): Increments atom.
* **Component B** (\`data-testid="atom-value-display"\`): Displays atom value.

Use \`jotai\` \`atom\` and \`useAtom\` so both components stay in sync without prop drilling.`,
    testids: ["atom-inc-btn", "atom-value-display"],
    markers: ["jotai", "atom", "useAtom", "countAtom"],
  },

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  {
    slug: "tanstack-query-basic",
    title: "TanStack Query: Basic useQuery",
    difficulty: "medium",
    tags: ["ecosystem-lib", "tanstack-query", "data-fetching"],
    packages: ["tanstack-query"],
    bases: ["base-react-js"],
    prompt: `Fetch a list of posts using TanStack Query \`useQuery\`.

* **Loading UI** (\`data-testid="rq-loading"\`).
* **Data UI** (\`data-testid="rq-data"\`).
* **Refetch Button** (\`data-testid="rq-refetch-btn"\`): Triggers \`refetch()\`.

Wrap the tree with \`QueryClientProvider\` and fetch from a mock/public posts endpoint.`,
    testids: ["rq-loading", "rq-data", "rq-refetch-btn"],
    markers: ["@tanstack/react-query", "useQuery", "QueryClientProvider"],
  },

  {
    slug: "tanstack-query-mutation",
    title: "TanStack Query: useMutation with Optimistic Updates",
    difficulty: "hard",
    tags: ["ecosystem-lib", "tanstack-query", "data-fetching", "mutation"],
    packages: ["tanstack-query"],
    bases: ["base-react-js"],
    prompt: `Build a comment submission form using TanStack Query \`useMutation\`.

* **Input** (\`data-testid="comment-input"\`).
* **Submit** (\`data-testid="comment-submit"\`).
* **Behavior**: Optimistically insert new comment into cached UI list before server responds.

Use \`onMutate\` / cache updates so the list reflects the new comment immediately.`,
    testids: ["comment-input", "comment-submit"],
    markers: ["@tanstack/react-query", "useMutation", "onMutate"],
  },

  {
    slug: "swr-stock-ticker",
    title: "SWR: Auto-Revalidation",
    difficulty: "medium",
    tags: ["ecosystem-lib", "swr", "data-fetching"],
    packages: ["swr"],
    bases: ["base-react-js"],
    prompt: `Build a live stock ticker display using SWR.

* **Ticker Display** (\`data-testid="stock-price"\`).
* **Refresh Status** (\`data-testid="swr-validating"\`): Shows "Updating..." when \`isValidating\` is true.

Use the \`swr\` hook with a fetcher; enable refresh/revalidation so \`isValidating\` can become true.`,
    testids: ["stock-price", "swr-validating"],
    markers: ["swr", "useSWR", "isValidating"],
  },

  {
    slug: "axios-auth-interceptor",
    title: "Axios Integration with Custom Interceptor Hook",
    difficulty: "medium",
    tags: ["ecosystem-lib", "axios", "auth", "http"],
    packages: ["axios"],
    bases: ["base-react-js"],
    prompt: `Build an API client UI component that handles 401 Unauthorized globally.

* **Fetch Button** (\`data-testid="axios-fetch-btn"\`).
* **Error Handler** (\`data-testid="global-auth-error"\`): Displays "Session Expired" when Axios interceptor catches a 401 response.

Register an Axios response interceptor that detects status 401 and surfaces the global error UI.`,
    testids: ["axios-fetch-btn", "global-auth-error"],
    markers: ["axios", "interceptors", "401"],
  },

  // ─── Forms & Validation ─────────────────────────────────────────────────────

  {
    slug: "rhf-registration",
    title: "React Hook Form: Basic Registration",
    difficulty: "medium",
    tags: ["ecosystem-lib", "react-hook-form", "forms"],
    packages: ["react-hook-form"],
    bases: ["base-react-js"],
    prompt: `Build a registration form using React Hook Form \`useForm\`.

* **Inputs**: Username (\`data-testid="input-username"\`), Password (\`data-testid="input-password"\`).
* **Error Messages**: Display field errors under inputs when submission fails validation.

Require both fields (e.g. non-empty; password min length) via RHF register/rules.`,
    testids: ["input-username", "input-password"],
    markers: ["react-hook-form", "useForm", "register"],
  },

  {
    slug: "rhf-zod-profile",
    title: "React Hook Form + Zod Resolver",
    difficulty: "hard",
    tags: ["ecosystem-lib", "react-hook-form", "zod", "forms"],
    packages: ["react-hook-form", "zod"],
    bases: ["base-react-js"],
    prompt: `Build a profile form validated against a Zod schema with React Hook Form.

* **Schema**: Email must be valid format, age must be a number ≥ 18.
* **Error Banner** (\`data-testid="zod-error-list"\`): Displays schema validation errors.

Use \`@hookform/resolvers/zod\` (\`zodResolver\`) with \`useForm\`.`,
    testids: ["zod-error-list"],
    markers: ["react-hook-form", "zod", "zodResolver"],
  },

  {
    slug: "formik-yup-checkout",
    title: "Formik + Yup: Multi-Field Form",
    difficulty: "medium",
    tags: ["ecosystem-lib", "formik", "yup", "forms"],
    packages: ["formik", "yup"],
    bases: ["base-react-js"],
    prompt: `Build a checkout billing address form using Formik and Yup.

* **Inputs**: Zip Code (\`data-testid="zip-input"\`).
* **Yup Rule**: Zip Code must match 5-digit regex (\`^\\d{5}$\`). Display error on blur if invalid.

Use Formik \`validateOnBlur\` (or equivalent) with a Yup schema.`,
    testids: ["zip-input"],
    markers: ["formik", "yup", "Formik"],
  },

  // ─── Animation ──────────────────────────────────────────────────────────────

  {
    slug: "framer-accordion",
    title: "Framer Motion: Animate Presence & Toggle",
    difficulty: "medium",
    tags: ["ecosystem-lib", "framer-motion", "animation"],
    packages: ["framer-motion"],
    bases: ["base-react-js"],
    prompt: `Build a collapsable accordion content box using Framer Motion.

* **Toggle Button** (\`data-testid="accordion-toggle"\`).
* **Animated Panel** (\`data-testid="motion-panel"\`): Fades and slides in/out using \`<AnimatePresence>\`.

Use \`framer-motion\` \`motion\` components with enter/exit animations.`,
    testids: ["accordion-toggle", "motion-panel"],
    markers: ["framer-motion", "AnimatePresence", "motion"],
  },

  {
    slug: "framer-drag-card",
    title: "Framer Motion: Drag Constraints",
    difficulty: "medium",
    tags: ["ecosystem-lib", "framer-motion", "animation", "drag"],
    packages: ["framer-motion"],
    bases: ["base-react-js"],
    prompt: `Build a draggable card component with Framer Motion.

* **Draggable Element** (\`data-testid="drag-card"\`): Constrained within a parent boundary container (\`data-testid="drag-container"\`).

Use \`drag\` and \`dragConstraints\` (ref or bounds) on a \`motion\` element.`,
    testids: ["drag-card", "drag-container"],
    markers: ["framer-motion", "drag", "dragConstraints"],
  },

  // ─── Utility Libraries ──────────────────────────────────────────────────────

  {
    slug: "react-select-multi",
    title: "React-Select: Async Searchable Dropdown",
    difficulty: "medium",
    tags: ["ecosystem-lib", "react-select", "forms"],
    packages: ["react-select"],
    bases: ["base-react-js"],
    prompt: `Build a searchable multi-select dropdown using \`react-select\`.

* **Select Input** (\`data-testid="react-select-input"\`).
* **Selection Output** (\`data-testid="selected-values"\`): Displays selected options as tags.

Enable \`isMulti\` and show the chosen values outside the control.`,
    testids: ["react-select-input", "selected-values"],
    markers: ["react-select", "isMulti"],
  },

  {
    slug: "i18next-greeting",
    title: "React-i18next: Internationalization",
    difficulty: "easy",
    tags: ["ecosystem-lib", "i18next", "i18n"],
    packages: ["i18next"],
    bases: ["base-react-js"],
    prompt: `Build a language selector app using \`react-i18next\`.

* **Language Switcher** (\`data-testid="lang-select"\`): Options \`en\`, \`es\`.
* **Greeting Text** (\`data-testid="translated-greeting"\`): Switches between "Hello" and "Hola".

Initialize i18next with English and Spanish resources and change language via the switcher.`,
    testids: ["lang-select", "translated-greeting"],
    markers: ["react-i18next", "i18next", "useTranslation"],
  },

  {
    slug: "tanstack-table-sort",
    title: "TanStack Table v8: Sortable Data Table",
    difficulty: "medium",
    tags: ["ecosystem-lib", "tanstack-table", "table"],
    packages: ["tanstack-table"],
    bases: ["base-react-js"],
    prompt: `Build a sortable data table using TanStack Table v8.

* **Column Header** (\`data-testid="sort-header-name"\`): Click to toggle sorting ASC/DESC.
* **Rows** (\`data-testid="table-row-[index]"\`).

Use \`@tanstack/react-table\` with sorting state and seed a small dataset including a name column.`,
    testids: ["sort-header-name", "table-row-0"],
    markers: ["@tanstack/react-table", "useReactTable", "getSortedRowModel"],
  },

  {
    slug: "recharts-bar",
    title: "Recharts: Dynamic Bar Chart",
    difficulty: "medium",
    tags: ["ecosystem-lib", "recharts", "charts"],
    packages: ["recharts"],
    bases: ["base-react-js"],
    prompt: `Build a responsive bar chart wrapper using Recharts.

* **Chart Container** (\`data-testid="recharts-wrapper"\`).
* **Filter Switch** (\`data-testid="chart-filter"\`): Switches dataset between "Monthly" and "Yearly".

Use \`BarChart\` / \`Bar\` (and responsive container as appropriate) from \`recharts\`.`,
    testids: ["recharts-wrapper", "chart-filter"],
    markers: ["recharts", "BarChart", "Bar"],
  },

  {
    slug: "virtualized-list",
    title: "React Virtualized / React-Window: Large List",
    difficulty: "hard",
    tags: ["ecosystem-lib", "virtualization", "performance"],
    packages: ["react-window"],
    bases: ["base-react-js"],
    prompt: `Build a virtualized list for 10,000 items.

* **List Container** (\`data-testid="virtual-list"\`).
* **Render Check**: Verify only visible DOM nodes (~10-15 elements) exist in the DOM at any scroll position.

Use \`react-window\` (or react-virtualized) so off-screen rows are not mounted.`,
    testids: ["virtual-list"],
    markers: ["react-window", "FixedSizeList", "VariableSizeList"],
  },

  {
    slug: "helmet-seo-meta",
    title: "React Helmet Async: SEO Meta Tags",
    difficulty: "easy",
    tags: ["ecosystem-lib", "helmet", "seo"],
    packages: ["helmet"],
    bases: ["base-react-js"],
    prompt: `Build a page head manager using \`react-helmet-async\`.

* **Dynamic Props**: \`title\`, \`description\` — controlled via inputs (\`data-testid="seo-title-input"\`, \`data-testid="seo-description-input"\`).
* **Verification**: Document head contains updated \`<title>\` and \`<meta name="description">\` tags.

Wrap with \`HelmetProvider\` and render \`Helmet\` from the dynamic props.`,
    testids: ["seo-title-input", "seo-description-input"],
    markers: ["react-helmet-async", "Helmet", "HelmetProvider"],
  },
];
