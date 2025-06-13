// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Changed from BrowserRouter to HashRouter
import App from "./App";

// Import global styles
import "./styles/theme.css";
import "./styles/global.css";
import "./index.css";

// Get root element
const rootElement = document.getElementById("root");

// Create and render app
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HashRouter>
        {" "}
        {/* Removed basename parameter as it's not needed with HashRouter */}
        <App />
      </HashRouter>
    </StrictMode>
  );
} else {
  console.error("Root element not found!");
}
