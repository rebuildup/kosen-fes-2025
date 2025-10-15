import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import { AppProviders } from "./AppProviders";
import LoadingIndicator from "./components/common/LoadingIndicator";
import Layout from "./components/layout/Layout";
import ErrorPage from "./pages/Error";

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const Exhibits = lazy(() => import("./pages/Exhibits"));
const TimeSchedule = lazy(() => import("./pages/TimeSchedule"));
const CampusMapPage = lazy(() => import("./pages/Map"));
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
    children: [
      { element: withSuspense(Home), index: true },
      { element: withSuspense(Events), path: "events" },
      { element: withSuspense(Exhibits), path: "exhibits" },
      { element: withSuspense(TimeSchedule), path: "schedule" },
      { element: withSuspense(CampusMapPage), path: "map" },
      { element: withSuspense(Detail), path: "detail/:type/:id" },
      { element: withSuspense(Search), path: "search" },
      { element: withSuspense(Bookmarks), path: "bookmarks" },
      { element: withSuspense(Sponsors), path: "sponsors" },
      { element: withSuspense(NotFound), path: "*" },
    ],
    element: (
      <AppProviders>
        <Layout />
      </AppProviders>
    ),
    errorElement: <ErrorPage />,
    path: "/",
  },
  // Content Submission route - separate from main layout
  {
    element: <AppProviders>{withSuspense(ContentPreview)}</AppProviders>,
    errorElement: <ErrorPage />,
    path: "/content-submission",
  },
];

export default routes;
