import { RouteObject } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Exhibits from "./pages/Exhibits";
import TimeSchedule from "./pages/TimeSchedule";
import Map from "./pages/Map";
import Detail from "./pages/Detail";
import Search from "./pages/Search";
import Bookmarks from "./pages/Bookmarks";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "events", element: <Events /> },
      { path: "exhibits", element: <Exhibits /> },
      { path: "schedule", element: <TimeSchedule /> },
      { path: "map", element: <Map /> },
      { path: "detail/:type/:id", element: <Detail /> },
      { path: "search", element: <Search /> },
      { path: "bookmarks", element: <Bookmarks /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
