import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import TimetablePage from "./pages/TimetablePage";
import MapPage from "./pages/MapPage";
import DetailPage from "./pages/DetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import BookmarksPage from "./pages/BookmarksPage";
import SettingsPage from "./pages/SettingsPage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<DetailPage />} />
      <Route path="/exhibitions" element={<ExhibitionsPage />} />
      <Route path="/exhibitions/:id" element={<DetailPage />} />
      <Route path="/food-stalls/:id" element={<DetailPage />} />
      <Route path="/timetable" element={<TimetablePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/bookmarks" element={<BookmarksPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/error" element={<ErrorPage />} />

      {/* 404 route - must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
