import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Error from "./pages/Error";
import LoadingIndicator from "./components/common/LoadingIndicator";
import { AppProviders } from "./AppProviders";

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const Exhibits = lazy(() => import("./pages/Exhibits"));
const TimeSchedule = lazy(() => import("./pages/TimeSchedule"));
const Map = lazy(() => import("./pages/Map"));
const Detail = lazy(() => import("./pages/Detail"));
const Search = lazy(() => import("./pages/Search"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const ContentPreview = lazy(() => import("./pages/ContentPreview"));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingIndicator />}>
    <Component />
  </Suspense>
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AppProviders>
        <Layout />
      </AppProviders>
    ),
    errorElement: <Error />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "events", element: withSuspense(Events) },
      { path: "exhibits", element: withSuspense(Exhibits) },
      { path: "schedule", element: withSuspense(TimeSchedule) },
      { path: "map", element: withSuspense(Map) },
      { path: "detail/:type/:id", element: withSuspense(Detail) },
      { path: "search", element: withSuspense(Search) },
      { path: "bookmarks", element: withSuspense(Bookmarks) },
      { path: "sponsors", element: withSuspense(Sponsors) },
      { path: "*", element: withSuspense(NotFound) },
    ],
  },
  // Content Submission route - separate from main layout
  {
    path: "/content-submission",
    element: <AppProviders>{withSuspense(ContentPreview)}</AppProviders>,
    errorElement: <Error />,
  },
];

export default routes;
