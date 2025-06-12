import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardHome from "./pages/DashboardHome";
import AboutPage from "./pages/AboutPage";
import WeatherDashboard from "./pages/WeatherDashboard";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/weather" element={<WeatherDashboard />} />
      </Routes>
    </Layout>
  );
}
