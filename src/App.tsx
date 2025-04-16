// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";

// Import correct page components
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Exhibits from "./pages/Exhibits/Exhibits";
import Timetable from "./pages/Timetable/Timetable";
import Map from "./pages/Map/Map";
import Search from "./pages/Search/Search";
import Detail from "./pages/Detail/Detail";
import Bookmarks from "./pages/Bookmarks/Bookmarks";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/map" element={<Map />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/detail/:type/:id" element={<Detail />} />
          {/* 404ページはHomeにリダイレクト */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
