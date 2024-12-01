import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import Lectures from "@/pages/accounts/lectures";
import Students from "@/pages/accounts/students";
import { Navigate, RouteObject } from "react-router-dom";

const AccountsRoutes: RouteObject[] = [
  {
    path: "/accounts",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="students" replace />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "lecturers",
        element: <Lectures />,
      },
    ],
  },
];

export default AccountsRoutes;
