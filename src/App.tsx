import { useRoutes } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { routes } from "./app/router/routes";

/**
 * Main application component
 * Handles routing and provides global context providers
 */
function App() {
  const routing = useRoutes(routes);

  return <AppProviders>{routing}</AppProviders>;
}

export default App;