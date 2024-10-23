import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Profile from "@/pages/profile";
import { Navigate, RouteObject } from "react-router-dom";

const ProfileRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="profile" replace />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];

export default ProfileRoutes;
