import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Topics } from "@/pages";
import { RouteObject } from "react-router-dom";

const SettingRoutes: RouteObject[] = [
  {
    path: "/topics",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Topics />,
      },
    ],
  },
];

export default SettingRoutes;
