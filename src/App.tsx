import { Outlet } from "react-router-dom";
import { AppProviders } from "./AppProviders";

/**
 * Main application component
 * Handles routing and provides global context providers
 */
function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Outlet />
      </div>
    </AppProviders>
  );
}

export default App;
