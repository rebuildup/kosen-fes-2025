import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Error from "../../pages/Error";
import LoadingIndicator from "../../shared/components/feedback/LoadingIndicator";

const Home = lazy(() => import("../../pages/Home"));
const Events = lazy(() => import("../../pages/Events"));
const Exhibits = lazy(() => import("../../pages/Exhibits"));
const TimeSchedule = lazy(() => import("../../pages/TimeSchedule"));
const Map = lazy(() => import("../../pages/Map"));
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
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
        handle: {
          crumb: "home",
        },
      },
      {
        path: "events",
        element: withSuspense(Events),
        handle: {
          crumb: "events",
        },
      },
      {
        path: "exhibits",
        element: withSuspense(Exhibits),
        handle: {
          crumb: "exhibits",
        },
      },
      {
        path: "schedule",
        element: withSuspense(TimeSchedule),
        handle: {
          crumb: "schedule",
        },
      },
      {
        path: "map",
        element: withSuspense(Map),
        handle: {
          crumb: "map",
        },
      },
      {
        path: "detail/:type/:id",
        element: withSuspense(Detail),
        handle: {
          crumb: "detail",
        },
      },
      {
        path: "search",
        element: withSuspense(Search),
        handle: {
          crumb: "search",
        },
      },
      {
        path: "bookmarks",
        element: withSuspense(Bookmarks),
        handle: {
          crumb: "bookmarks",
        },
      },
      {
        path: "sponsors",
        element: withSuspense(Sponsors),
        handle: {
          crumb: "sponsors",
        },
      },
      {
        path: "*",
        element: withSuspense(NotFound),
        handle: {
          crumb: "notfound",
        },
      },
    ],
  },
];

export default routes;
