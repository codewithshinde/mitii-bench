import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadTaskDir, shapePrompt } from "../src/loader.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const cookieConsentDir = join(
  root,
  "suites/js/atomic/frontend/cookie-consent",
);

test("shapePrompt strips other-base For lines", () => {
  const shared = [
    "Build a banner.",
    "",
    "For `base-react-js`, implement the UI in `src/App.jsx`.",
    "",
    'For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).',
    "",
  ].join("\n");

  const react = shapePrompt(shared, "base-react-js");
  assert.match(react, /src\/App\.jsx/);
  assert.doesNotMatch(react, /base-next-js/);
  assert.doesNotMatch(react, /app\/page\.jsx/);

  const next = shapePrompt(shared, "base-next-js");
  assert.match(next, /app\/page\.jsx/);
  assert.doesNotMatch(next, /base-react-js/);
  assert.doesNotMatch(next, /src\/App\.jsx/);
});

test("shapePrompt injects react entry when Next-only hint is stripped", () => {
  const shared = [
    "Build a banner.",
    "",
    'For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).',
    "",
  ].join("\n");

  const react = shapePrompt(shared, "base-react-js");
  assert.match(react, /For `base-react-js`/);
  assert.match(react, /src\/App\.jsx/);
  assert.doesNotMatch(react, /app\/page\.jsx/);
});

test("cookie-consent instances get base-shaped prompts", () => {
  const react = loadTaskDir(cookieConsentDir, root, "base-react-js");
  const next = loadTaskDir(cookieConsentDir, root, "base-next-js");

  assert.equal(react.base, "base-react-js");
  assert.equal(next.base, "base-next-js");
  assert.match(react.prompt, /src\/App\.jsx/);
  assert.doesNotMatch(react.prompt, /app\/page\.jsx/);
  assert.match(next.prompt, /app\/page\.jsx/);
  assert.doesNotMatch(next.prompt, /src\/App\.jsx/);
});
