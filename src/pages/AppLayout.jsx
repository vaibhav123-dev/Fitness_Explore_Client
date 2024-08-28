import React from "react";
import { Header } from "../components/Header";
import { Toaster } from "./../components/Toaster";
import { Navigate, Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useAuth } from "../hooks/auth";

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

export const AuthLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Toaster />
      <Outlet />
      <Footer />
    </>
  );
};
