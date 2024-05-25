import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function LandingPageLayout() {
  return (
    <div className="flex justify-between w-full  flex-col">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}
