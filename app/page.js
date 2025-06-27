// page.js

"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Homepage from "./pages/Home";
import ProfileDashboard from "./pages/ProfileDashboard";

export default function Home() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<ProfileDashboard />} />
      </Routes>
    </>
  );
}
