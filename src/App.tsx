// src/App.tsx
import { useRoutes } from "react-router-dom";
import { AppProviders } from "./AppProviders";
import routes from "./routes";

function App() {
  const routing = useRoutes(routes);

  return <AppProviders>{routing}</AppProviders>;
}

export default App;
