import React from "react";
import { Header } from "../components/Header";
import { Toaster } from "./../components/Toaster";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";

export const AppLayout = () => {
  return (
    <div>
      <Header />
      <Toaster />
      <Outlet />
      <Footer />
    </div>
  );
};
