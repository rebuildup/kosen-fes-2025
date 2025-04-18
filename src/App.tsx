import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/layout/Layout";
import AppRoutes from "./router";
import "./styles/globals.css";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AppProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
