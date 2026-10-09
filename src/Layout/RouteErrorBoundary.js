import React from "react";

// Keeps a crashing page from blanking the whole layout (sidebar/header stay usable).
class RouteErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Page crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", color: "#000" }}>
          <h2 style={{ color: "#000" }}>Something went wrong</h2>
          <p style={{ color: "#000" }}>
            This page could not be loaded. Please pick another menu item or
            reload.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
