import { Outlet } from "react-router-dom";
import { AppProviders } from "./AppProviders";

/**
 * Main application component
 * Handles routing and provides global context providers
 */
function App() {
  return (
    <AppProviders>
      <div>
        <Outlet />
      </div>
    </AppProviders>
  );
}

export default App;
