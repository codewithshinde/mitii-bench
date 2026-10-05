Build a persistent text box using a custom hook `useLocalStorage`.

* **Input Field** (`data-testid="persistent-input"`).
* **Behavior**: Typing into input updates state and saves to `localStorage`. Page reload restores value from `localStorage`.

For `base-react-js`, implement the UI in `src/App.jsx`.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
