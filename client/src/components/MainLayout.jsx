import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./MainLayout.css"; // Import the CSS file

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
