import { Component, useState } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-fallback">Something went wrong</div>;
    }
    return this.props.children;
  }
}

function Buggy() {
  const [crash, setCrash] = useState(false);
  if (crash) throw new Error("Boom");
  return (
    <button data-testid="crash-btn" onClick={() => setCrash(true)}>
      Crash
    </button>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  );
}
