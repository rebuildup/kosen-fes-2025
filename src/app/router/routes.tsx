import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import ErrorPage from "../../pages/Error";
import LoadingIndicator from "../../shared/components/feedback/LoadingIndicator";

const Home = lazy(() => import("../../pages/Home"));
const Events = lazy(() => import("../../pages/Events"));
const Exhibits = lazy(() => import("../../pages/Exhibits"));
const TimeSchedule = lazy(() => import("../../pages/TimeSchedule"));
const CampusMapPage = lazy(() => import("../../pages/Map"));
const Detail = lazy(() => import("../../pages/Detail"));
const Search = lazy(() => import("../../pages/Search"));
const Bookmarks = lazy(() => import("../../pages/Bookmarks"));
const NotFound = lazy(() => import("../../pages/NotFound"));
const Sponsors = lazy(() => import("../../pages/Sponsors"));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingIndicator />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    children: [
      {
        element: withSuspense(Home),
        handle: {
          crumb: "home",
        },
        index: true,
      },
      {
        element: withSuspense(Events),
        handle: {
          crumb: "events",
        },
        path: "events",
      },
      {
        element: withSuspense(Exhibits),
        handle: {
          crumb: "exhibits",
        },
        path: "exhibits",
      },
      {
        element: withSuspense(TimeSchedule),
        handle: {
          crumb: "schedule",
        },
        path: "schedule",
      },
      {
        element: withSuspense(CampusMapPage),
        handle: {
          crumb: "map",
        },
        path: "map",
      },
      {
        element: withSuspense(Detail),
        handle: {
          crumb: "detail",
        },
        path: "detail/:type/:id",
      },
      {
        element: withSuspense(Search),
        handle: {
          crumb: "search",
        },
        path: "search",
      },
      {
        element: withSuspense(Bookmarks),
        handle: {
          crumb: "bookmarks",
        },
        path: "bookmarks",
      },
      {
        element: withSuspense(Sponsors),
        handle: {
          crumb: "sponsors",
        },
        path: "sponsors",
      },
      {
        element: withSuspense(NotFound),
        handle: {
          crumb: "notfound",
        },
        path: "*",
      },
    ],
    element: <Layout />,
    errorElement: <ErrorPage />,
    path: "/",
  },
];

export default routes;
