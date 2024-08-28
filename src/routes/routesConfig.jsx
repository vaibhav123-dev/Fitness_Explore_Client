import { AppLayout, AuthLayout } from "../pages/AppLayout.jsx";
import { ErrorPage } from "../pages/Error.jsx";
import { Login } from "../pages/Login.jsx";
import { ProfilePage } from "../pages/ProfilePage.jsx";
import { Home } from "./../pages/Home";
import { Signup } from "./../pages/Signup";

const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/register",
        element: <Signup />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
];

export { routes };
