// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BookmarkProvider } from "./contexts/BookmarkContext";
import { AppProvider } from "./contexts/AppContext";
import "./styles/global.css";
import "./styles/variables.css";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <BookmarkProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </BookmarkProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
